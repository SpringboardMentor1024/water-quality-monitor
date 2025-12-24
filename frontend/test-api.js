console.log("Testing backend connectivity...");

const endpoints = [
    "http://localhost:5000",
    "http://localhost:8000", 
    "http://localhost:3001",
    "http://localhost:8080"
];

async function testEndpoints() {
    for (const url of endpoints) {
        try {
            console.log(`\nTrying ${url}...`);
            const response = await fetch(url);
            console.log(`✅ ${url} responded with status: ${response.status}`);
        } catch (error) {
            console.log(`❌ ${url} failed: ${error.message}`);
        }
    }
}

testEndpoints();