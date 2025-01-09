using Newtonsoft.Json;
using System;

public class WeatherResponse
{
    [JsonProperty("coord")]
    public Coord Coord { get; set; }

    [JsonProperty("weather")]
    public Weather[] Weather { get; set; }

    [JsonProperty("base")]
    public string Base { get; set; }

    [JsonProperty("main")]
    public Main Main { get; set; }

    [JsonProperty("visibility")]
    public int Visibility { get; set; }

    [JsonProperty("wind")]
    public Wind Wind { get; set; }

    [JsonProperty("rain")]
    public Rain Rain { get; set; }

    [JsonProperty("clouds")]
    public Clouds Clouds { get; set; }

    [JsonProperty("dt")]
    public long Dt { get; set; }

    [JsonProperty("sys")]
    public Sys Sys { get; set; }

    [JsonProperty("timezone")]
    public int Timezone { get; set; }

    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("cod")]
    public int Cod { get; set; }
}

public class Coord
{
    [JsonProperty("lon")]
    public float Lon { get; set; }

    [JsonProperty("lat")]
    public float Lat { get; set; }
}

public class Weather
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("main")]
    public string Main { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("icon")]
    public string Icon { get; set; }
}

public class Main
{
    [JsonProperty("temp")]
    public float Temp { get; set; }

    [JsonProperty("feels_like")]
    public float FeelsLike { get; set; }

    [JsonProperty("temp_min")]
    public float TempMin { get; set; }

    [JsonProperty("temp_max")]
    public float TempMax { get; set; }

    [JsonProperty("pressure")]
    public int Pressure { get; set; }

    [JsonProperty("humidity")]
    public int Humidity { get; set; }

    [JsonProperty("sea_level")]
    public int SeaLevel { get; set; }

    [JsonProperty("grnd_level")]
    public int GrndLevel { get; set; }
}

public class Wind
{
    [JsonProperty("speed")]
    public float Speed { get; set; }

    [JsonProperty("deg")]
    public int Deg { get; set; }

    [JsonProperty("gust")]
    public float Gust { get; set; }
}

public class Rain
{
    [JsonProperty("1h")]
    public float? OneHour { get; set; }
}

public class Clouds
{
    [JsonProperty("all")]
    public int All { get; set; }
}

public class Sys
{
    [JsonProperty("type")]
    public int Type { get; set; }

    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("country")]
    public string Country { get; set; }

    [JsonProperty("sunrise")]
    public long Sunrise { get; set; }

    [JsonProperty("sunset")]
    public long Sunset { get; set; }
}
