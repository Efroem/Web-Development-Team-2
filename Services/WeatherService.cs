using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;  // Use Newtonsoft.Json to deserialize JSON responses
using Microsoft.Extensions.Configuration;

public class WeatherService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public WeatherService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<WeatherResponse> GetWeatherAsync()
    {
        var lat = 51.9179086;
        var lon = 4.4877837;

        var apiKey = _configuration["WeatherAPI:OpenWeatherMapApiKey"]; // Store API key in appsettings.json or environment variable
        var url = $"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}";  // Use the correct units (metric, imperial)

        var response = await _httpClient.GetStringAsync(url);
        return JsonConvert.DeserializeObject<WeatherResponse>(response);
    }

    public async Task<string> GetKey(){
        return _configuration["WeatherAPI:OpenWeatherMapApiKey"];
    }
}


