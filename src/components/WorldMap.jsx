import React, { useState, useRef, useEffect } from 'react';

const WorldMap = () => {
    const canvasRef = useRef(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [indicator, setIndicator] = useState('NY.GDP.PCAP.CD');
    const [year, setYear] = useState('2022');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mapData, setMapData] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [mapTiles, setMapTiles] = useState({});
    const [tilesLoaded, setTilesLoaded] = useState(false);
    const [mapView, setMapView] = useState({centerLat: 0, centerLng: 0, zoom: 1});
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [showLabels, setShowLabels] = useState(true);

    const regions = {
        northAmerica: {
            name: 'North America',
            countries: ['USA', 'CAN', 'MEX', 'GTM', 'CUB', 'DOM', 'HTI', 'JAM', 'CRI', 'PAN'],
            color: '#ff6b6b',
            bounds: { north: 72, south: 7, west: -168, east: -52 }
        },
        southAmerica: {
            name: 'South America',
            countries: ['BRA', 'ARG', 'CHL', 'COL', 'PER', 'URY', 'PRY', 'BOL', 'ECU', 'VEN', 'GUY', 'SUR'],
            color: '#4ecdc4',
            bounds: { north: 13, south: -56, west: -82, east: -33 }
        },
        europe: {
            name: 'Europe',
            countries: ['DEU', 'FRA', 'GBR', 'ITA', 'ESP', 'NLD', 'BEL', 'CHE', 'AUT', 'SWE', 'NOR', 'DNK', 'FIN', 'POL', 'CZE', 'HUN', 'ROU', 'BGR', 'GRC', 'PRT', 'IRL', 'SVK', 'SVN', 'EST', 'LVA', 'LTU', 'HRV', 'SRB', 'BIH', 'MNE', 'MKD', 'ALB', 'UKR', 'BLR'],
            color: '#45b7d1',
            bounds: { north: 71, south: 35, west: -25, east: 40 }
        },
        africa: {
            name: 'Africa',
            countries: ['ZAF', 'NGA', 'EGY', 'KEN', 'ETH', 'GHA', 'UGA', 'TZA', 'MOZ', 'AGO', 'DZA', 'MAR', 'TUN', 'LBY', 'SDN', 'TCD', 'NER', 'MLI', 'BFA', 'SEN', 'GMB', 'GIN', 'SLE', 'LBR', 'CIV', 'MDG', 'MWI', 'ZMB', 'ZWE', 'BWA', 'NAM', 'SWZ', 'LSO', 'RWA', 'BDI', 'CAF', 'CMR', 'GAB', 'COG', 'COD', 'SOM', 'DJI', 'ERI'],
            color: '#f9ca24',
            bounds: { north: 37, south: -35, west: -18, east: 52 }
        },
        asia: {
            name: 'Asia',
            countries: ['CHN', 'IND', 'JPN', 'RUS', 'KOR', 'THA', 'VNM', 'IDN', 'MYS', 'SGP', 'PHL', 'KHM', 'LAO', 'MMR', 'BGD', 'PAK', 'AFG', 'IRN', 'IRQ', 'TUR', 'SAU', 'ARE', 'QAT', 'KWT', 'BHR', 'OMN', 'YEM', 'JOR', 'LBN', 'SYR', 'ISR', 'PSE', 'GEO', 'ARM', 'AZE', 'KAZ', 'UZB', 'TKM', 'KGZ', 'TJK', 'MNG', 'NPL', 'BTN', 'LKA', 'MDV'],
            color: '#a55eea',
            bounds: { north: 78, south: -11, west: 25, east: 180 }
        },
        oceania: {
            name: 'Oceania',
            countries: ['AUS', 'NZL', 'PNG', 'FJI', 'NCL', 'SLB', 'VUT', 'WSM', 'TON', 'PLW', 'FSM', 'MHL', 'KIR', 'NRU', 'TUV'],
            color: '#26de81',
            bounds: { north: 0, south: -47, west: 110, east: -160 }
        }
    };

    const countryCoordinates = {
        'USA': { name: 'USA', lat: 39.8283, lng: -98.5795 },
        'CAN': { name: 'Canada', lat: 56.1304, lng: -106.3468 },
        'MEX': { name: 'Mexico', lat: 23.6345, lng: -102.5528 },
        'GTM': { name: 'Guatemala', lat: 15.7835, lng: -90.2308 },
        'CUB': { name: 'Cuba', lat: 21.5218, lng: -77.7812 },
        'DOM': { name: 'Dominican Rep.', lat: 18.7357, lng: -70.1627 },
        'HTI': { name: 'Haiti', lat: 18.9712, lng: -72.2852 },
        'JAM': { name: 'Jamaica', lat: 18.1096, lng: -77.2975 },
        'CRI': { name: 'Costa Rica', lat: 9.7489, lng: -83.7534 },
        'PAN': { name: 'Panama', lat: 8.538, lng: -80.7821 },

        'BRA': { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
        'ARG': { name: 'Argentina', lat: -38.4161, lng: -63.6167 },
        'CHL': { name: 'Chile', lat: -35.6751, lng: -71.5430 },
        'COL': { name: 'Colombia', lat: 4.5709, lng: -74.2973 },
        'PER': { name: 'Peru', lat: -9.1900, lng: -75.0152 },
        'URY': { name: 'Uruguay', lat: -32.5228, lng: -55.7658 },
        'PRY': { name: 'Paraguay', lat: -23.4425, lng: -58.4438 },
        'BOL': { name: 'Bolivia', lat: -16.2902, lng: -63.5887 },
        'ECU': { name: 'Ecuador', lat: -1.8312, lng: -78.1834 },
        'VEN': { name: 'Venezuela', lat: 6.4238, lng: -66.5897 },
        'GUY': { name: 'Guyana', lat: 4.8604, lng: -58.9302 },
        'SUR': { name: 'Suriname', lat: 3.9193, lng: -56.0278 },

        'DEU': { name: 'Germany', lat: 51.1657, lng: 10.4515 },
        'FRA': { name: 'France', lat: 46.6034, lng: 1.8883 },
        'GBR': { name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
        'ITA': { name: 'Italy', lat: 41.8719, lng: 12.5674 },
        'ESP': { name: 'Spain', lat: 40.4637, lng: -3.7492 },
        'NLD': { name: 'Netherlands', lat: 52.1326, lng: 5.2913 },
        'BEL': { name: 'Belgium', lat: 50.5039, lng: 4.4699 },
        'CHE': { name: 'Switzerland', lat: 46.8182, lng: 8.2275 },
        'AUT': { name: 'Austria', lat: 47.5162, lng: 14.5501 },
        'SWE': { name: 'Sweden', lat: 60.1282, lng: 18.6435 },
        'NOR': { name: 'Norway', lat: 60.4720, lng: 8.4689 },
        'DNK': { name: 'Denmark', lat: 56.2639, lng: 9.5018 },
        'FIN': { name: 'Finland', lat: 61.9241, lng: 25.7482 },
        'POL': { name: 'Poland', lat: 51.9194, lng: 19.1451 },
        'CZE': { name: 'Czech Republic', lat: 49.8175, lng: 15.4730 },
        'HUN': { name: 'Hungary', lat: 47.1625, lng: 19.5033 },
        'ROU': { name: 'Romania', lat: 45.9432, lng: 24.9668 },
        'BGR': { name: 'Bulgaria', lat: 42.7339, lng: 25.4858 },
        'GRC': { name: 'Greece', lat: 39.0742, lng: 21.8243 },
        'PRT': { name: 'Portugal', lat: 39.3999, lng: -8.2245 },
        'IRL': { name: 'Ireland', lat: 53.4129, lng: -8.2439 },

        'ZAF': { name: 'South Africa', lat: -30.5595, lng: 22.9375 },
        'EGY': { name: 'Egypt', lat: 26.0975, lng: 31.1391 },
        'NGA': { name: 'Nigeria', lat: 9.0820, lng: 8.6753 },
        'KEN': { name: 'Kenya', lat: -0.0236, lng: 37.9062 },
        'GHA': { name: 'Ghana', lat: 7.9465, lng: -1.0232 },
        'ETH': { name: 'Ethiopia', lat: 9.1450, lng: 40.4897 },
        'UGA': { name: 'Uganda', lat: 1.3733, lng: 32.2903 },
        'TZA': { name: 'Tanzania', lat: -6.3690, lng: 34.8888 },
        'MOZ': { name: 'Mozambique', lat: -18.6657, lng: 35.5296 },
        'AGO': { name: 'Angola', lat: -11.2027, lng: 17.8739 },
        'DZA': { name: 'Algeria', lat: 28.0339, lng: 1.6596 },
        'MAR': { name: 'Morocco', lat: 31.7917, lng: -7.0926 },
        'TUN': { name: 'Tunisia', lat: 33.8869, lng: 9.5375 },
        'LBY': { name: 'Libya', lat: 26.3351, lng: 17.2283 },
        'SDN': { name: 'Sudan', lat: 12.8628, lng: 30.2176 },

        'CHN': { name: 'China', lat: 35.8617, lng: 104.1954 },
        'IND': { name: 'India', lat: 20.5937, lng: 78.9629 },
        'JPN': { name: 'Japan', lat: 36.2048, lng: 138.2529 },
        'RUS': { name: 'Russia', lat: 61.5240, lng: 105.3188 },
        'KOR': { name: 'South Korea', lat: 35.9078, lng: 127.7669 },
        'THA': { name: 'Thailand', lat: 15.8700, lng: 100.9925 },
        'VNM': { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
        'IDN': { name: 'Indonesia', lat: -0.7893, lng: 113.9213 },
        'MYS': { name: 'Malaysia', lat: 4.2105, lng: 101.9758 },
        'SGP': { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
        'PHL': { name: 'Philippines', lat: 12.8797, lng: 121.7740 },
        'KHM': { name: 'Cambodia', lat: 12.5657, lng: 104.9910 },
        'LAO': { name: 'Laos', lat: 19.8563, lng: 102.4955 },
        'MMR': { name: 'Myanmar', lat: 21.9162, lng: 95.9560 },
        'BGD': { name: 'Bangladesh', lat: 23.6850, lng: 90.3563 },
        'PAK': { name: 'Pakistan', lat: 30.3753, lng: 69.3451 },
        'AFG': { name: 'Afghanistan', lat: 33.9391, lng: 67.7100 },
        'IRN': { name: 'Iran', lat: 32.4279, lng: 53.6880 },
        'IRQ': { name: 'Iraq', lat: 33.2232, lng: 43.6793 },
        'TUR': { name: 'Turkey', lat: 38.9637, lng: 35.2433 },
        'SAU': { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792 },
        'ARE': { name: 'UAE', lat: 23.4241, lng: 53.8478 },
        'QAT': { name: 'Qatar', lat: 25.3548, lng: 51.1839 },
        'KWT': { name: 'Kuwait', lat: 29.3117, lng: 47.4818 },
        'BHR': { name: 'Bahrain', lat: 25.9304, lng: 50.6378 },
        'OMN': { name: 'Oman', lat: 21.4735, lng: 55.9754 },
        'YEM': { name: 'Yemen', lat: 15.5527, lng: 48.5164 },
        'JOR': { name: 'Jordan', lat: 30.5852, lng: 36.2384 },
        'LBN': { name: 'Lebanon', lat: 33.8547, lng: 35.8623 },
        'SYR': { name: 'Syria', lat: 34.8021, lng: 38.9968 },
        'ISR': { name: 'Israel', lat: 31.0461, lng: 34.8516 },

        'AUS': { name: 'Australia', lat: -25.2744, lng: 133.7751 },
        'NZL': { name: 'New Zealand', lat: -40.9006, lng: 174.8860 },
        'PNG': { name: 'Papua New Guinea', lat: -6.3150, lng: 143.9555 },
        'FJI': { name: 'Fiji', lat: -16.5780, lng: 179.4144 },
        'NCL': { name: 'New Caledonia', lat: -20.9043, lng: 165.6180 },
        'SLB': { name: 'Solomon Islands', lat: -9.6457, lng: 160.1562 }
    };

    const indicators = {
        'NY.GDP.PCAP.CD': 'GDP per capita (USD)',
        'SP.DYN.LE00.IN': 'Life expectancy (years)',
        'SE.ADT.LITR.ZS': 'Literacy rate (%)',
        'SL.UEM.TOTL.ZS': 'Unemployment rate (%)'
    };

    const detectLabelCollisions = (labels, canvasWidth, canvasHeight) => {
        const minDistance = 50;
        const collisions = [];
        const margin = 80;

        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];

            if (label.x < margin || label.x > canvasWidth - margin || label.y < margin || label.y > canvasHeight - margin) {
                collisions.push({ i, boundary: true });
            }
            for (let j = i + 1; j < labels.length; j++) {
                const label1 = labels[i];
                const label2 = labels[j];

                const distance = Math.sqrt(Math.pow(label1.x - label2.x, 2) + Math.pow(label1.y - label2.y, 2));

                if (distance < minDistance) {
                    collisions.push({ i, j, distance });
                }
            }
        }
        return collisions;
    };

    const repositionLabels = (labels, canvasWidth = 800, canvasHeight = 500) => {
        if (!labels || labels.length === 0) return labels;
        const maxIterations = 30;
        const maxDistance = 100;
        const margin = 80;
        let iteration = 0;

        const workingLabels = labels.map(label => ({...label}));

        while (iteration < maxIterations) {
            const collisions = detectLabelCollisions(workingLabels, canvasWidth, canvasHeight);
            if (collisions.length === 0) break;

            let moved = false;
            collisions.forEach(collision => {
                if (collision.boundary) {
                    const label = workingLabels[collision.i];
                    const originalDistance = Math.sqrt(Math.pow(label.x - label.originalX, 2) + Math.pow(label.y - label.originalY, 2));
                    if (originalDistance < maxDistance) {
                        const centerX = canvasWidth / 2;
                        const centerY = canvasHeight / 2;
                        const pushX = (centerX - label.x) * 0.1;
                        const pushY = (centerY - label.y) * 0.1;
                        
                        const newX = label.x + pushX;
                        const newY = label.y + pushY;

                        const newDistance = Math.sqrt(Math.pow(newX - label.originalX, 2) + Math.pow(newY - label.originalY, 2));
                        
                        if (newDistance <= maxDistance) {
                            label.x = Math.max(margin, Math.min(canvasWidth - margin, newX));
                            label.y = Math.max(margin, Math.min(canvasHeight - margin, newY));
                            moved = true;
                        }
                    }
                } else if (collision.j !== undefined) {
                    const label1 = workingLabels[collision.i];
                    const label2 = workingLabels[collision.j];

                    const dx = label2.x - label1.x;
                    const dy = label2.y - label1.y;
                    const distance = collision.distance;

                    if (distance > 0) {
                        const pushDistance = (50 - distance) / 4;
                        const pushX = (dx / distance) * pushDistance;
                        const pushY = (dy / distance) * pushDistance;
                        
                        const newLabel1X = label1.x - pushX;
                        const newLabel1Y = label1.y - pushY;
                        const newLabel2X = label2.x + pushX;
                        const newLabel2Y = label2.y + pushY;
                        
                        const dist1 = Math.sqrt(Math.pow(newLabel1X - label1.originalX, 2) + Math.pow(newLabel1Y - label1.originalY, 2));
                        const dist2 = Math.sqrt(Math.pow(newLabel2X - label2.originalX, 2) + Math.pow(newLabel2Y - label2.originalY, 2));
                        
                        if (dist1 <= maxDistance && dist2 <= maxDistance) {
                            label1.x = Math.max(margin, Math.min(canvasWidth - margin, newLabel1X));
                            label1.y = Math.max(margin, Math.min(canvasHeight - margin, newLabel1Y));
                            label2.x = Math.max(margin, Math.min(canvasWidth - margin, newLabel2X));
                            label2.y = Math.max(margin, Math.min(canvasHeight - margin, newLabel2Y));
                            moved = true;
                        }
                    }
                }
            });
            if (!moved) break;

            iteration++;
        }
        return workingLabels;
    };

    const latLngToCanvas = (lat, lng, canvasWidth, canvasHeight) => {
        if (!canvasWidth || !canvasHeight || isNaN(lat) || isNaN(lng)) {
            return { x: 0, y: 0 };
        }
        
        const scale = 256 * Math.pow(2, mapView.zoom);
        
        const worldX = (lng + 180) / 360 * scale;
        const latRad = lat * Math.PI / 180;
        const worldY = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale;
        
        const centerWorldX = (mapView.centerLng + 180) / 360 * scale;
        const centerLatRad = mapView.centerLat * Math.PI / 180;
        const centerWorldY = (1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2 * scale;
        
        const x = canvasWidth / 2 + (worldX - centerWorldX);
        const y = canvasHeight / 2 + (worldY - centerWorldY);
        
        return { x, y };
    };

    const zoomToRegion = (regionKey) => {
        const region = regions[regionKey];
        if (!region) return;

        const bounds = region.bounds;
        const centerLat = (bounds.north + bounds.south) / 2;
        let centerLng = (bounds.west + bounds.east) / 2;

        if (bounds.west > bounds.east) {
            centerLng = ((bounds.west + bounds.east + 360) / 2) % 360;
            if (centerLng > 180) centerLng -= 360;
        }

        const latRange = bounds.north - bounds.south;
        const lngRange = bounds.west > bounds.east ? (360 - bounds.west + bounds.east) : (bounds.east - bounds.west);
        
        const maxRange = Math.max(latRange, lngRange);
        let zoom = 1;
        if (maxRange < 180) zoom = 2;
        if (maxRange < 90) zoom = 3;
        if (maxRange < 45) zoom = 4;
        if (maxRange < 22) zoom = 5;

        setMapView({centerLat, centerLng, zoom});
    };

    const resetView = () => {
        setMapView({centerLat: 0, centerLng: 0, zoom: 1});
    };

    const loadMapTiles = async () => {
        const tiles = {};
        const promises = [];

        const zoomLevels = [1, 2, 3];

        for (const zoom of zoomLevels) {
            const maxTiles = Math.pow(2, zoom);
            for (let x = 0; x < maxTiles; x++) {
                for (let y = 0; y < maxTiles; y++) {
                    const promise = new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            tiles[`${zoom}-${x}-${y}`] = img;
                            resolve();
                        };
                        img.onerror = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 256;
                            canvas.height = 256;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#2c5aa0';
                            ctx.fillRect(0, 0, 256, 256);
                            tiles[`${zoom}-${x}-${y}`] = canvas;
                            resolve();
                        };
                        img.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                    });
                    promises.push(promise);
                }
            }
        }
        
        try {
            await Promise.all(promises);
            setMapTiles(tiles);
            setTilesLoaded(true);
        } catch (error) {
            console.warn('Some tiles failed to load, using fallback');
            setMapTiles(tiles);
            setTilesLoaded(true);
        }
    };

    useEffect(() => {
        loadMapTiles();
    }, []);

    useEffect(() => {
        if (tilesLoaded) {
            drawWorldMap();
        }
    }, [tilesLoaded, selectedRegion, mapData, mapView, hoveredCountry]);

    const fetchWorldBankData = async (indicator, year, countries = null) => {
        let url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${year}&format=json&per_page=300`;
        
        if (countries && countries.length > 0) {
            const countryList = countries.join(';');
            url = `https://api.worldbank.org/v2/country/${countryList}/indicator/${indicator}?date=${year}&format=json&per_page=300`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || data.length < 2 || !data[1]) {
                throw new Error('Data not found');
            }
            
            const filteredData = data[1].filter(item => 
                item && 
                item.value !== null && 
                item.value !== undefined && 
                !isNaN(item.value) &&
                item.countryiso3code
            );
            
            if (filteredData.length === 0) {
                throw new Error('No valid data available for the selected parameters');
            }
            
            return filteredData;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
    };

    const drawWorldMap = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(0, 0, width, height);

        if (tilesLoaded && Object.keys(mapTiles).length > 0) {
            const tileSize = 256;
            const tileZoom = Math.min(3, Math.max(1, Math.floor(mapView.zoom)));
            const tilesPerRow = Math.pow(2, tileZoom);
            const scale = Math.pow(2, mapView.zoom - tileZoom);
            const scaledTileSize = tileSize * scale;
            
            const centerTileX = (mapView.centerLng + 180) / 360 * tilesPerRow;
            const centerLatRad = mapView.centerLat * Math.PI / 180;
            const centerTileY = (1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2 * tilesPerRow;
            
            const offsetX = width / 2 - centerTileX * scaledTileSize;
            const offsetY = height / 2 - centerTileY * scaledTileSize;

            for (let x = 0; x < tilesPerRow; x++) {
                for (let y = 0; y < tilesPerRow; y++) {
                    const tileKey = `${tileZoom}-${x}-${y}`;
                    const tile = mapTiles[tileKey];
                    
                    if (tile) {
                        const tileX = offsetX + x * scaledTileSize;
                        const tileY = offsetY + y * scaledTileSize;
                        
                        if (tileX + scaledTileSize > 0 && tileX < width && 
                            tileY + scaledTileSize > 0 && tileY < height) {
                            ctx.drawImage(tile, tileX, tileY, scaledTileSize, scaledTileSize);
                        }
                    }
                }
            }
        }

        Object.entries(countryCoordinates).forEach(([code, coord]) => {
            const canvasCoord = latLngToCanvas(coord.lat, coord.lng, width, height);
            
            if (canvasCoord.x >= -10 && canvasCoord.x <= width + 10 && 
                canvasCoord.y >= -10 && canvasCoord.y <= height + 10) {
                
                ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.beginPath();
                const radius = mapView.zoom >= 3 ? 6 : 4;
                ctx.arc(canvasCoord.x, canvasCoord.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        });

        if (selectedRegion && mapData) {
            drawDataVisualization(ctx, mapData);
        } else if (selectedRegion) {
            const region = regions[selectedRegion];
            region.countries.forEach(countryCode => {
                const coord = countryCoordinates[countryCode];
                if (coord) {
                    const canvasCoord = latLngToCanvas(coord.lat, coord.lng, width, height);
                    if (canvasCoord.x >= -10 && canvasCoord.x <= width + 10 && canvasCoord.y >= -10 && canvasCoord.y <= height + 10) {
                        
                        ctx.fillStyle = region.color;
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        const radius = mapView.zoom >= 3 ? 10 : 8;
                        ctx.arc(canvasCoord.x, canvasCoord.y, radius, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            });
        }

        if (hoveredCountry) {
            drawToolTip(ctx, hoveredCountry);
        }

        drawRegionButtons(ctx, width, height);
        drawHeader(ctx, width);
    };

    const drawDataVisualization = (ctx, data) => {
        if (!data || data.length === 0) return;
        
        const values = data.map(d => d.value).filter(v => v !== null && !isNaN(v));
        if (values.length === 0) return;

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;

        const labels = [];
        const points = [];

        data.forEach(item => {
            const countryCode = item.countryiso3code;
            const coord = countryCoordinates[countryCode];
            
            if (coord && item.value !== null && !isNaN(item.value)) {
                const canvasCoord = latLngToCanvas(coord.lat, coord.lng, ctx.canvas.width, ctx.canvas.height);
                
                if (canvasCoord.x >= -20 && canvasCoord.x <= ctx.canvas.width + 20 && 
                    canvasCoord.y >= -20 && canvasCoord.y <= ctx.canvas.height + 20) {
                    
                    const normalized = range > 0 ? (item.value - min) / range : 0;
                    const intensity = Math.floor(normalized * 255);
                    const color = `rgb(${255 - intensity}, ${Math.floor(255 - intensity * 0.5)}, 255)`;
                    
                    points.push({
                        x: canvasCoord.x,
                        y: canvasCoord.y,
                        color,
                        countryCode,
                        coord,
                        item
                    });

                    const displayValue = typeof item.value === 'number' ? 
                        item.value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : 
                        item.value;
                    
                    labels.push({
                        x: canvasCoord.x,
                        y: canvasCoord.y + 35,
                        text: displayValue,
                        countryName: coord.name,
                        originalX: canvasCoord.x,
                        originalY: canvasCoord.y,
                        countryCode
                    });
                }
            }
        });
        const adjustedLabels = showLabels ? repositionLabels([...labels], ctx.canvas.width, ctx.canvas.height) : [];

        points.forEach(point => {
            ctx.fillStyle = point.color;
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const radius = mapView.zoom >= 3 ? 14 : 12;
            ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        });

        if (showLabels) {
            adjustedLabels.forEach(label => {
                const distance = Math.sqrt(Math.pow(label.x - label.originalX, 2) + Math.pow(label.y - label.originalY, 2));

                if (distance > 25) {
                    ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    ctx.moveTo(label.originalX, label.originalY - 35);
                    ctx.lineTo(label.x, label.y - 10);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                ctx.font = 'bold 10px Arial';
                const valueWidth = ctx.measureText(label.text).width;
                ctx.font = '9px Arial';
                const nameWidth = ctx.measureText(label.countryName).width;
                const textWidth = Math.max(valueWidth, nameWidth);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                const labelPadding = 6;
                const labelWidth = textWidth + (labelPadding * 2);
                const labelHeight = 25;
                
                ctx.fillRect(label.x - labelWidth/2, label.y - 20, labelWidth, labelHeight);
                ctx.strokeRect(label.x - labelWidth/2, label.y - 20, labelWidth, labelHeight);
                
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                
                ctx.font = '9px Arial';
                ctx.fillText(label.countryName, label.x, label.y - 10);
                
                ctx.font = 'bold 10px Arial';
                ctx.fillText(label.text, label.x, label.y - 2);
            });
        }
        drawLegend(ctx, min, max);
    };

    const drawToolTip = (ctx, countryData) => {
        const { x, y, countryName, value } = countryData;

        ctx.font = '12px Arial';
        const text1 = countryName;
        const text2 = value ? `${indicators[indicator]}: ${value}` : 'No data available';
        
        const maxWidth = Math.max(ctx.measureText(text1).width, ctx.measureText(text2).width);
        const tooltipWidth = maxWidth + 20;
        const tooltipHeight = 40;
        
        let tooltipX = x + 15;
        let tooltipY = y - 25;
        
        if (tooltipX + tooltipWidth > ctx.canvas.width) tooltipX = x - tooltipWidth - 15;
        if (tooltipY < 0) tooltipY = y + 15;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(text1, tooltipX + 10, tooltipY + 15);
        ctx.font = '11px Arial';
        ctx.fillText(text2, tooltipX + 10, tooltipY + 30);
    };

    const drawHeader = (ctx, width) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, width, 80);
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`World Socioeconomic ${indicators[indicator]} - ${year}`, width/2, 30);

        if (selectedRegion) {
            ctx.font = '16px Arial';
            ctx.fillText(`Selected: ${regions[selectedRegion].name} (Zoom: ${mapView.zoom}x)`, width/2, 55);
        } else {
            ctx.font = '14px Arial';
            ctx.fillText('Click on region buttons to select and zoom to a region', width/2, 55);
        }
    };

    const drawRegionButtons = (ctx, width, height) => {
        const buttonY = height - 50;
        const buttonHeight = 30;
        const buttonSpacing = 8;
        
        const buttonWidths = {};
        let totalWidth = 0;
        
        Object.entries(regions).forEach(([key, region]) => {
            ctx.font = '12px Arial';
            const textWidth = ctx.measureText(region.name).width;
            const buttonWidth = textWidth + 20;
            buttonWidths[key] = buttonWidth;
            totalWidth += buttonWidth;
        });
        
        totalWidth += (Object.keys(regions).length - 1) * buttonSpacing;
        let currentX = (width - totalWidth) / 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(0, buttonY - 5, width, 40);

        Object.entries(regions).forEach(([key, region]) => {
            const buttonWidth = buttonWidths[key];
            const isSelected = selectedRegion === key;
            
            ctx.fillStyle = isSelected ? region.color : '#f0f0f0';
            ctx.strokeStyle = isSelected ? '#333' : '#999';
            ctx.lineWidth = isSelected ? 2 : 1;
            ctx.fillRect(currentX, buttonY, buttonWidth, buttonHeight);
            ctx.strokeRect(currentX, buttonY, buttonWidth, buttonHeight);
            
            ctx.fillStyle = isSelected ? '#fff' : '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(region.name, currentX + buttonWidth/2, buttonY + 20);
            
            currentX += buttonWidth + buttonSpacing;
        });
    };

    const drawLegend = (ctx, min, max) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const legendX = width - 220;
        const legendY = height - 80;
        const legendWidth = 180;
        const legendHeight = 20;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(legendX - 10, legendY - 10, legendWidth + 20, 50);

        const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0);
        gradient.addColorStop(0, 'rgb(255, 255, 255)');
        gradient.addColorStop(1, 'rgb(0, 128, 255)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
        
        ctx.strokeStyle = '#000';
        ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
        
        ctx.fillStyle = '#000';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Min: ${min.toLocaleString('en-US', { maximumFractionDigits: 1 })}`, legendX, legendY + legendHeight + 15);
        ctx.textAlign = 'right';
        ctx.fillText(`Max: ${max.toLocaleString('en-US', { maximumFractionDigits: 1 })}`, legendX + legendWidth, legendY + legendHeight + 15);
    };

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const { width, height } = canvas;

        const buttonY = height - 50;
        const buttonHeight = 30;
        const buttonSpacing = 8;
        
        const ctx = canvas.getContext('2d');
        ctx.font = '12px Arial';
        
        const buttonWidths = {};
        let totalWidth = 0;
        
        Object.entries(regions).forEach(([key, region]) => {
            const textWidth = ctx.measureText(region.name).width;
            const buttonWidth = textWidth + 20;
            buttonWidths[key] = buttonWidth;
            totalWidth += buttonWidth;
        });
        
        totalWidth += (Object.keys(regions).length - 1) * buttonSpacing;
        let currentX = (width - totalWidth) / 2;

        for (const [key, region] of Object.entries(regions)) {
            const buttonWidth = buttonWidths[key];
            
            if (x >= currentX && x <= currentX + buttonWidth && 
                y >= buttonY && y <= buttonY + buttonHeight) {
                
                const isCurrentlySelected = selectedRegion === key;
                
                if (isCurrentlySelected) {
                    setSelectedRegion(null);
                    resetView();
                } else {
                    setSelectedRegion(key);
                    zoomToRegion(key);
                }
                setMapData(null);
                setDownloadUrl('');
                setHoveredCountry(null);
                return;
            }
            
            currentX += buttonWidth + buttonSpacing;
        }
        if (mapData) {
            let foundCountry = null;

            mapData.forEach(item => {
                const countryCode = item.countryiso3code;
                const coord = countryCoordinates[countryCode];

                if (coord) {
                    const canvasCoord = latLngToCanvas(coord.lat, coord.lng, canvas.width, canvas.height);
                    const distance = Math.sqrt(Math.pow(x - canvasCoord.x, 2) + Math.pow(y - canvasCoord.y, 2));
                    const radius = mapView.zoom >= 3 ? 14 : 12;
                    if (distance <= radius) {
                        foundCountry = { 
                            x: canvasCoord.x, 
                            y: canvasCoord.y, 
                            countryName: coord.name, 
                            value: item.value ? item.value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : null 
                        };
                    }
                }
            });
            setHoveredCountry(foundCountry);
        }
    };

    const generateMap = async () => {
        if (!selectedRegion) {
            setError('Please select a region first');
            return;
        }

        setLoading(true);
        setError('');
        setHoveredCountry(null);

        try {
            const regionData = regions[selectedRegion];
            const data = await fetchWorldBankData(indicator, year, regionData.countries);
            
            if (!data || data.length === 0) {
                throw new Error('No data available for the selected region and indicator');
            }
            
            setMapData(data);

            setTimeout(() => {
                const canvas = canvasRef.current;
                if (canvas) {
                    try {
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                setDownloadUrl(url);
                            }
                        }, 'image/jpeg', 0.9);
                    } catch (error) {
                        console.warn('Download generation failed:', error);
                    }
                }
            }, 100);
        } catch (err) {
            setError(err.message || 'Failed to generate visualization');
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedRegion(null);
        setMapData(null);
        setDownloadUrl('');
        setError('');
        setHoveredCountry(null);
        resetView();
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', maxWidth: '1200px' }}>
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>
                        Indicator:
                    </label>
                    <select 
                        value={indicator} 
                        onChange={(e) => setIndicator(e.target.value)} 
                        style={{ padding: '5px', margin: '5px', width: '250px' }}
                    >
                        {Object.entries(indicators).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>
                        Year:
                    </label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: '5px', margin: '5px', width: '100px' }}>
                        {['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>
                        Show Labels:
                    </label>
                    <input 
                        type="checkbox" 
                        checked={showLabels} 
                        onChange={(e) => setShowLabels(e.target.checked)}
                        style={{ margin: '5px' }}
                    />
                    <small style={{ color: '#666', marginLeft: '10px' }}>
                        Uncheck to reduce text overlap
                    </small>
                </div>

                <div>
                    <button onClick={generateMap} disabled={loading || !selectedRegion} style={{ background: loading ? '#ccc' : !selectedRegion ? '#ccc' : '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: loading || !selectedRegion ? 'not-allowed' : 'pointer', margin: '5px' }}>
                        {loading ? 'Generating...' : 'Generate Data Visualization'}
                    </button>

                    <button onClick={clearSelection} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>
                        Clear Selection
                    </button>

                    <button onClick={resetView} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>
                        Reset View
                    </button>

                    {downloadUrl && (
                        <a href={downloadUrl} download={`indicators-${selectedRegion}-${year}.jpg`} style={{ background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', margin: '5px', display: 'inline-block' }}>
                            Download JPG
                        </a>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ background: '#ffe6e6', color: '#cc0000', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
                    {error}
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <canvas ref={canvasRef} width={800} height={500} onClick={handleCanvasClick} style={{ border: '2px solid #ddd', cursor: 'pointer', maxWidth: '100%', display: 'block', margin: '0 auto', borderRadius: '5px' }} />
                <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    {!tilesLoaded ? 'Loading satellite map...' : selectedRegion ? 
                        `Viewing ${regions[selectedRegion].name} at ${mapView.zoom}x zoom - Click the region button again to deselect` : 
                        'Click on region buttons in the map to select and zoom to a region'}
                </p>
            </div>
        </div>
    );
};

export default WorldMap;