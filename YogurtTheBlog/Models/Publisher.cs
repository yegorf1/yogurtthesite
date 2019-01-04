using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using YogurtTheBlog.Enums;

namespace YogurtTheBlog.Models {
    public class Publisher {
        public string Name { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public PublisherType PublisherType { get; set; }
        public string Token { get; set; }
    }
}