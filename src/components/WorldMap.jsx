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

    const regions = {
        northAmerica: {
            name: 'North America',
            bounds: { x: 50, y: 80, width: 200, height: 150 },
            countries: ['USA', 'CAN', 'MEX'],
            color: '#ff6b6b'
        },
        southAmerica: {
            name: 'South America',
            bounds: { x: 200, y: 280, width: 150, height: 200 },
            countries: ['BRA', 'ARG', 'CHL', 'COL', 'PER'],
            color: '#4ecdc4'
        },
        europe: {
            name: 'Europe',
            bounds: { x: 430, y: 120, width: 80, height: 80 },
            countries: ['DEU', 'FRA', 'GBR', 'ITA', 'ESP'],
            color: '#45b7d1'
        },
        africa: {
            name: 'Africa',
            bounds: { x: 450, y: 200, width: 120, height: 250 },
            countries: ['ZAF', 'NGA', 'EGY', 'KEN', 'ETH'],
            color: '#f9ca24'
        },
        asia: {
            name: 'Asia',
            bounds: { x: 520, y: 80, width: 200, height: 200 },
            countries: ['CHN', 'IND', 'JPN', 'RUS', 'KOR'],
            color: '#a55eea'
        },
        oceania: {
            name: 'Oceania',
            bounds: { x: 650, y: 380, width: 100, height: 80 },
            countries: ['AUS', 'NZL', 'PNG', 'FJI'],
            color: '#26de81'
        }
    };

    const countryCoordinates = {
        'BRA': { name: 'Brazil', x: 300, y: 350 },
        'USA': { name: 'USA', x: 150, y: 180 },
        'CHN': { name: 'China', x: 650, y: 200 },
        'IND': { name: 'India', x: 600, y: 250 },
        'DEU': { name: 'Germany', x: 480, y: 150 },
        'FRA': { name: 'France', x: 460, y: 160 },
        'GBR': { name: 'United Kingdom', x: 450, y: 140 },
        'JPN': { name: 'Japan', x: 720, y: 200 },
        'RUS': { name: 'Russia', x: 580, y: 120 },
        'CAN': { name: 'Canada', x: 150, y: 100 },
        'AUS': { name: 'Australia', x: 700, y: 400 },
        'ARG': { name: 'Argentina', x: 280, y: 420 },
        'MEX': { name: 'Mexico', x: 120, y: 220 },
        'ZAF': { name: 'South Africa', x: 520, y: 420 },
        'EGY': { name: 'Egypt', x: 510, y: 250 },
        'NGA': { name: 'Nigeria', x: 480, y: 300 },
        'KEN': { name: 'Kenya', x: 540, y: 330 },
        'ITA': { name: 'Italy', x: 490, y: 170 },
        'ESP': { name: 'Spain', x: 440, y: 170 },
        'KOR': { name: 'South Korea', x: 720, y: 190 },
        'NZL': { name: 'New Zeeland', x: 750, y: 450 }
    };

    const indicators = {
        'NY.GDP.PCAP.CD': 'GDP per capita (USD)',
        'SP.DYN.LE00.IN': 'Life expectancy (years)',
        'SE.ADT.LITR.ZS': 'Literacy rate (%)',
        'SL.UEM.TOTL.ZS': 'Unemployment rate (%)'
    };

    useEffect(() => {
        drawBaseMap();
    }, [selectedRegion]);

    const fetchWorldBankData = async (indicator, year, countries = null) => {
        let url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${year}&format=json&per_page=300`;
        
        if (countries && countries.length > 0) {
            const countryList = countries.join(';');
            url = `https://api.worldbank.org/v2/country/${countryList}/indicator/${indicator}?date=${year}&format=json&per_page=300`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data || data.length < 2 || !data[1]) {
                throw new Error('Data not found');
            }
            
            return data[1].filter(item => item.value !== null);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    };

    const drawBaseMap = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, width, height);

        Object.entries(regions).forEach(([key, region]) => {
            const isSelected = selectedRegion === key;
            
            ctx.fillStyle = isSelected ? region.color : '#e8e8e8';
            ctx.strokeStyle = isSelected ? '#333' : '#999';
            ctx.lineWidth = isSelected ? 3 : 1;
            
            ctx.fillRect(region.bounds.x, region.bounds.y, region.bounds.width, region.bounds.height);
            ctx.strokeRect(region.bounds.x, region.bounds.y, region.bounds.width, region.bounds.height);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            const centerX = region.bounds.x + region.bounds.width / 2;
            const centerY = region.bounds.y + region.bounds.height / 2;
            ctx.fillText(region.name, centerX, centerY);
        });

        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select a region to see indicators', width/2, 30);

        if (selectedRegion) {
            ctx.font = '14px Arial';
            ctx.fillText(`Selected region: ${regions[selectedRegion].name}`, width/2, 50);
        }
    };

    const drawDataMap = (data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        drawBaseMap();

        if (!data || data.length === 0) return;
        
        const values = data.map(d => d.value).filter(v => v !== null && !isNaN(v));
        if (values.length === 0) return;
        
        const min = Math.min(...values);
        const max = Math.max(...values);

        data.forEach(item => {
            const countryCode = item.countryiso3code;
            const coord = countryCoordinates[countryCode];
            
            if (coord && item.value !== null && !isNaN(item.value)) {
                const normalized = (item.value - min) / (max - min);
                const intensity = Math.floor(normalized * 255);
                const color = `rgb(${255 - intensity}, ${Math.floor(255 - intensity * 0.5)}, 255)`;
                
                ctx.fillStyle = color;
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(coord.x, coord.y, 12, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                const displayValue = typeof item.value === 'number' ? item.value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : item.value;
                ctx.fillText(displayValue, coord.x, coord.y + 25);
                
                ctx.font = '9px Arial';
                ctx.fillText(coord.name, coord.x, coord.y - 15);
            }
        });

        drawLegend(ctx, min, max, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${indicators[indicator]} - ${year}`, 20, canvas.height - 20);
    };

    const drawLegend = (ctx, min, max, width, height) => {
        const legendX = width - 220;
        const legendY = height - 80;
        const legendWidth = 180;
        const legendHeight = 20;

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
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (const [key, region] of Object.entries(regions)) {
            const { bounds } = region;
            if (x >= bounds.x && x <= bounds.x + bounds.width &&
                y >= bounds.y && y <= bounds.y + bounds.height) {
                setSelectedRegion(key);
                break;
            }
        }
    };

    const generateMap = async () => {
        if (!selectedRegion) {
            setError('Select a region first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const regionData = regions[selectedRegion];
            const data = await fetchWorldBankData(indicator, year, regionData.countries);
            setMapData(data);
            drawDataMap(data);

            const canvas = canvasRef.current;
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                setDownloadUrl(url);
            }, 'image/jpeg', 0.9);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedRegion(null);
        setMapData(null);
        setDownloadUrl('');
        drawBaseMap();
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', maxWidth: '1200px' }}>
            <h1>World Socioeconomic Indicators</h1>

            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <label style={{ display: 'inline-block', width: '120px', fontWeight: 'bold' }}>
                    Indicator:
                </label>
                <select value={indicator} onChange={(e) => setIndicator(e.target.value)} style={{ padding: '5px', margin: '5px', width: '250px' }}>
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
                    {['2022', '2021', '2020', '2019'].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={generateMap} disabled={loading || !selectedRegion} style={{ background: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', margin: '5px' }}>
                    {loading ? 'Generating...' : 'Generate Map'}
                </button>

                <button onClick={clearSelection} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>
                    Clear Selection
                </button>

                {downloadUrl && (
                    <a href={downloadUrl} download={`indicadores-${selectedRegion}-${year}.jpg`} style={{ background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', margin: '5px', display: 'inline-block' }}>
                        Download JPG
                    </a>
                )}
            </div>

            {error && (
                <div style={{ background: '#ffe6e6', color: '#cc0000', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
                    {error}
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <canvas ref={canvasRef} width={800} height={500} onClick={handleCanvasClick} style={{ border: '1px solid #ddd', cursor: 'pointer', maxWidth: '100%', display: 'block', margin: '0 auto' }} />
                <p style={{ marginTop: '10px', color: '#333' }}>
                    Click on a region to select it!
                </p>
            </div>
        </div>
    );
};

export default WorldMap;