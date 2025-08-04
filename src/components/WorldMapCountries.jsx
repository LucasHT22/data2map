import React, { useState, useRef, useEffect } from 'react';

const WorldMap = () => {
    const canvasRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
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
    const latLngToCanvas = (lat, lng, canvasWidth, canvasHeight) => {
        if (!canvasWidth || !canvasHeight || isNaN(lat) || isNaN(lng)) return { x: 0, y: 0 };
        const scale = 256 * Math.pow(2, mapView.zoom);
        const worldX = (lng + 180) / 360 * scale;
        const latRad = lat * Math.PI / 180;
        const worldY = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale;
        const centerWorldX = (mapView.centerLng + 180) / 360 * scale;
        const centerLatRad = mapView.centerLat * Math.PI / 180;
        const centerWorldY = (1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2 * scale;
        return { x: canvasWidth / 2 + (worldX - centerWorldX), y: canvasHeight / 2 + (worldY - centerWorldY) };
    };

    const zoomToCountry = (countryCode) => {
        const coord = countryCoordinates[countryCode];
        if (!coord) return;
        setMapView({centerLat: coord.lat, centerLng: coord.lng, zoom: 4});
    };

    const resetView = () => setMapView({centerLat: 0, centerLng: 0, zoom: 1});

    const loadMapTiles = async () => {
        const tiles = {}, promises = [];

        for (const zoom of [1, 2, 3]) {
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
        await Promise.all(promises).catch(() => console.warn('Some tiles failed to load, using fallback'));
        setMapTiles(tiles);
        setTilesLoaded(true);
    };

    useEffect(() => { loadMapTiles(); }, []);

    useEffect(() => { if (tilesLoaded) drawWorldMap(); }, [tilesLoaded, selectedCountry, mapData, mapView, hoveredCountry]);

    const fetchWorldBankData = async (indicator, year) => {
        const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${year}&format=json&per_page=300`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data || data.length < 2 || !data[1]) throw new Error('Data not found');
            
            const filteredData = data[1].filter(item => 
                item?.value !== null && !isNaN(item.value) && item.countryiso3code
            );
            
            if (filteredData.length === 0) throw new Error('No valid data available for the selected parameters');
            return filteredData;
        } catch (error) {
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
            const tileZoom = Math.min(3, Math.max(1, Math.floor(mapView.zoom)));
            const tilesPerRow = Math.pow(2, tileZoom);
            const scale = Math.pow(2, mapView.zoom - tileZoom);
            const scaledTileSize = 256 * scale;
            
            const centerTileX = (mapView.centerLng + 180) / 360 * tilesPerRow;
            const centerLatRad = mapView.centerLat * Math.PI / 180;
            const centerTileY = (1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2 * tilesPerRow;
            
            const offsetX = width / 2 - centerTileX * scaledTileSize;
            const offsetY = height / 2 - centerTileY * scaledTileSize;
            const tilesNeededX = Math.ceil(width / scaledTileSize) + 2;
            const tilesNeededY = Math.ceil(height / scaledTileSize) + 2;
            const startTileX = Math.floor(-offsetX / scaledTileSize);
            const startTileY = Math.floor(-offsetY / scaledTileSize);

            for (let x = 0; x < tilesNeededX; x++) {
                for (let y = 0; y < tilesNeededY; y++) {
                    let tileX = (startTileX + x) % tilesPerRow;
                    let tileY = Math.max(0, Math.min(tilesPerRow - 1, startTileY + y));
                    if (tileX < 0) tileX += tilesPerRow;

                    const tile = mapTiles[`${tileZoom}-${tileX}-${tileY}`];
                    if (tile) {
                        const drawX = offsetX + (startTileX + x) * scaledTileSize;
                        const drawY = offsetY + (startTileY + y) * scaledTileSize;
                        
                        if (drawX + scaledTileSize > 0 && drawX < width && drawY + scaledTileSize > 0 && drawY < height) {
                            ctx.drawImage(tile, drawX, drawY, scaledTileSize, scaledTileSize);
                        }
                    }
                }
            }
        }

        const drawCountryPoints = (countries, color, isSelected = false) => {
            countries.forEach(code => {
                const coord = countryCoordinates[code];
                if (!coord) return;

                const positions = [latLngToCanvas(coord.lat, coord.lng, width, height)];
                if (mapView.zoom <= 2) {
                    positions.push(
                        latLngToCanvas(coord.lat, coord.lng - 360, width, height),
                        latLngToCanvas(coord.lat, coord.lng + 360, width, height)
                    );
                }

                positions.forEach(pos => {
                    if (pos.x >= -10 && pos.x <= width + 10 && pos.y >= -10 && pos.y <= height + 10) {
                        ctx.fillStyle = isSelected ? color : 'rgba(200, 200, 200, 0.8)';
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = isSelected ? 2 : 1;
                        ctx.beginPath();
                        const radius = isSelected ? (mapView.zoom >= 3 ? 10 : 8) : (mapView.zoom >= 3 ? 6 : 4);
                        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                });
            });
        };

        Object.values(countryCoordinates).forEach(coord => {
            const pos = latLngToCanvas(coord.lat, coord.lng, width, height);
            if (pos.x >= -10 && pos.x <= width + 10 && pos.y >= -10 && pos.y <= height + 10) {
                ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, mapView.zoom >= 3 ? 6 : 4, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        });

        if (mapData) {
            drawDataVisualization(ctx, mapData);
        } else {
            Object.entries(countryCoordinates).forEach(([code, coord]) => {
                const pos = latLngToCanvas(coord.lat, coord.lng, width, height);
                if (pos.x >= -10 && pos.x <= width + 10 && pos.y >= -10 && pos.y <= height + 10) {
                    ctx.fillStyle = selectedCountry === code ? '#ff6b6b' : 'rgba(200, 200, 200, 0.8)';
                    ctx.strokeStyle = '#333'; ctx.lineWidth = selectedCountry === code ? 2 : 1;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, selectedCountry === code ? 10 : 6, 0, 2 * Math.PI);
                    ctx.fill(); ctx.stroke();   
                }
            });
        }

        if (hoveredCountry) drawToolTip(ctx, hoveredCountry);
        drawHeader(ctx, width);
    };

    const drawDataVisualization = (ctx, data) => {
        if (!data?.length) return;
        const values = data.map(d => d.value).filter(v => v !== null && !isNaN(v));
        if (!values.length) return;
        const min = Math.min(...values), max = Math.max(...values), range = max - min;

        data.forEach(item => {
            const coord = countryCoordinates[item.countryiso3code];
            if (!coord || item.value === null || isNaN(item.value)) return;
            const canvasCoord = latLngToCanvas(coord.lat, coord.lng, ctx.canvas.width, ctx.canvas.height);
            if (canvasCoord.x < -20 || canvasCoord.x > ctx.canvas.width + 20) return;
            
            const normalized = range > 0 ? (item.value - min) / range : 0;
            const intensity = Math.floor(normalized * 255);
            ctx.fillStyle = `rgb(${255 - intensity}, ${Math.floor(255 - intensity * 0.5)}, 255)`;
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(canvasCoord.x, canvasCoord.y, mapView.zoom >= 3 ? 14 : 12, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();

            if (showLabels) {
                const text = item.value.toLocaleString('en-US', { maximumFractionDigits: 1 });
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(canvasCoord.x - 25, canvasCoord.y + 15, 50, 15);
                ctx.fillStyle = '#000'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
                ctx.fillText(text, canvasCoord.x, canvasCoord.y + 25);
            }
        });
        drawLegend(ctx, min, max);
    };

    const drawToolTip = (ctx, { x, y, countryName, value }) => {
        const text1 = countryName, text2 = value ? `${indicators[indicator]}: ${value}` : 'No data available';
        ctx.font = '12px Arial';
        const maxWidth = Math.max(ctx.measureText(text1).width, ctx.measureText(text2).width);
        const tooltipWidth = maxWidth + 20, tooltipHeight = 40;
        
        let tooltipX = x + 15, tooltipY = y - 25;
        
        if (tooltipX + tooltipWidth > ctx.canvas.width) tooltipX = x - tooltipWidth - 15;
        if (tooltipY < 0) tooltipY = y + 15;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px Arial';
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
        ctx.font = selectedCountry ? '16px Arial' : '14px Arial';
        ctx.fillText(selectedCountry ? `Selected: ${selectedCountry} (Zoom: 4x)` : 'Click on region buttons to select and zoom to a region', width/2, 55);
    };

    const drawLegend = (ctx, min, max) => {
        const legendX = ctx.canvas.width - 220, legendY = ctx.canvas.height - 80;
        const legendWidth = 180, legendHeight = 20;

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
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        
        const clickedCountry = Object.entries(countryCoordinates).find(([code, coord]) => {
            const canvasCoord = latLngToCanvas(coord.lat, coord.lng, canvas.width, canvas.height);
            const distance = Math.sqrt(Math.pow(x - canvasCoord.x, 2) + Math.pow(y - canvasCoord.y, 2));
            return distance <= 15;
        });
        if (clickedCountry) {
            const [code] = clickedCountry;
            setSelectedCountry(selectedCountry === code ? null : code);
            if (selectedCountry !== code) zoomToCountry(code);
        }
        if (mapData) {
            const foundCountry = mapData.find(item => {
                const coord = countryCoordinates[item.countryiso3code];
                if (!coord) return false;
                const canvasCoord = latLngToCanvas(coord.lat, coord.lng, canvas.width, canvas.height);
                return Math.sqrt(Math.pow(x - canvasCoord.x, 2) + Math.pow(y - canvasCoord.y, 2)) <= 14;
            });
            setHoveredCountry(foundCountry ? {
                x: latLngToCanvas(countryCoordinates[foundCountry.countryiso3code].lat, countryCoordinates[foundCountry.countryiso3code].lng, canvas.width, canvas.height).x,
                y: latLngToCanvas(countryCoordinates[foundCountry.countryiso3code].lat, countryCoordinates[foundCountry.countryiso3code].lng, canvas.width, canvas.height).y,
                countryName: countryCoordinates[foundCountry.countryiso3code].name,
                value: foundCountry.value?.toLocaleString('en-US', { maximumFractionDigits: 1 })
            } : null);
        }
    };

    const generateMap = async () => {
        setLoading(true);
        setError('');
        setHoveredCountry(null);
        try {
            const data = await fetchWorldBankData(indicator, year);
            setMapData(data);
            setTimeout(() => {
                const canvas = canvasRef.current;
                if (canvas) {
                    canvas.toBlob(blob => {
                        if (blob) setDownloadUrl(URL.createObjectURL(blob));
                    }, 'image/jpeg', 0.9);
                }
            }, 100);
        } catch (err) {
            setError(err.message || 'Failed to generate visualization');
        } finally {
            setLoading(false);
        }
    }

    const clearSelection = () => {
        [setSelectedCountry, setMapData, setDownloadUrl, setError, setHoveredCountry].forEach(setter => setter(null));
        setSelectedCountry('');
        setError('');
        resetView();
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', maxWidth: '1200px' }}>
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>Indicator:</label>
                    <select value={indicator} onChange={(e) => setIndicator(e.target.value)} style={{ padding: '5px', margin: '5px', width: '250px' }}>
                        {Object.entries(indicators).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>Year:</label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: '5px', margin: '5px', width: '100px' }}>
                        {['2022', '2021', '2020', '2019', '2018'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>Focus Country:</label>
                    <select value={selectedCountry || ''} onChange={(e) => { setSelectedCountry(e.target.value || null); if (e.target.value) zoomToCountry(e.target.value); }} style={{ padding: '5px', margin: '5px', width: '150px' }}>
                        <option value="">All Countries</option>
                        {Object.entries(countryCoordinates).map(([code, coord]) => <option key={code} value={code}>{coord.name}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>Show Labels:</label>
                    <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} style={{ margin: '5px' }}/>
                </div>

                <div>
                    <button onClick={generateMap} disabled={loading} style={{ background: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', margin: '5px' }}>
                        {loading ? 'Loading...' : 'Show All Data'}
                    </button>
                    <button onClick={clearSelection} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>
                        Clear
                    </button>
                    <button onClick={resetView} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>
                        Reset View
                    </button>
                    {downloadUrl && (
                        <a href={downloadUrl} download={`world-data-${year}.jpg`} style={{ background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', margin: '5px', display: 'inline-block' }}>
                            Download JPG
                        </a>
                    )}
                </div>
            </div>

            {error && <div style={{ background: '#ffe6e6', color: '#cc0000', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>{error}</div>}

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <canvas ref={canvasRef} width={800} height={500} onClick={handleCanvasClick} style={{ border: '2px solid #ddd', cursor: 'pointer', maxWidth: '100%', display: 'block', margin: '0 auto', borderRadius: '5px' }} />
                <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    {!tilesLoaded ? 'Loading map...' : 'Click countries to focus or generate data to see all countries with available data'}
                </p>
            </div>
        </div>
    );
};

export default WorldMap;