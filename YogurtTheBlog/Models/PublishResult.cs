using System.Security.Policy;

namespace YogurtTheBlog.Models {
    public class PublishResult {
        public string PublisherName { get; set; }
            
        public bool IsSuccess { get; set; }
        public string Error { get; set; }
        public Url LinkToPost { get; set; }
        public string InternalId { get; set; }
    }
}