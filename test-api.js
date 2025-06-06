// Simple test script to check if the /public API endpoint with pagination is working
const fetch = require("node-fetch");

async function testPublicAPI() {
  const baseUrl = "http://localhost:8000/api/v2/posts";

  try {
    console.log("🧪 Testing /public endpoint...");

    // Test 1: Initial request without cursor
    console.log("\n1️⃣ Testing initial request (no cursor):");
    const response1 = await fetch(`${baseUrl}/public?limit=5`);
    const data1 = await response1.json();

    console.log("Status:", response1.status);
    console.log("Response:", JSON.stringify(data1, null, 2));

    if (data1.success && data1.posts && data1.pagination) {
      console.log("✅ Initial request successful");
      console.log(`📊 Posts received: ${data1.posts.length}`);
      console.log(`🔄 Has more: ${data1.pagination.hasMore}`);
      console.log(`📅 Next cursor: ${data1.pagination.nextCursor}`);

      // Test 2: Request with cursor if available
      if (data1.pagination.nextCursor && data1.pagination.hasMore) {
        console.log("\n2️⃣ Testing request with cursor:");
        const response2 = await fetch(
          `${baseUrl}/public?cursor=${encodeURIComponent(
            data1.pagination.nextCursor
          )}&limit=5`
        );
        const data2 = await response2.json();

        console.log("Status:", response2.status);
        console.log("Response:", JSON.stringify(data2, null, 2));

        if (data2.success) {
          console.log("✅ Cursor-based request successful");
          console.log(`📊 Posts received: ${data2.posts.length}`);
          console.log(`🔄 Has more: ${data2.pagination.hasMore}`);
        } else {
          console.log("❌ Cursor-based request failed");
        }
      } else {
        console.log("ℹ️ No more posts available for cursor test");
      }
    } else {
      console.log("❌ Initial request failed");
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    console.log(
      "💡 Make sure the backend server is running on http://localhost:8000"
    );
  }
}

// Run the test
testPublicAPI();
