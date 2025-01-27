export async function GET(req) {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data from the API: ${response.statusText}`);
      }
  
      const countries = await response.json();
  
      if (!countries || countries.length === 0) {
        throw new Error("No countries data received from the API.");
      }
  
      return new Response(JSON.stringify(countries), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error in API route:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to load countries data", message: error.message }),
        { status: 500 }
      );
    }
  }
  