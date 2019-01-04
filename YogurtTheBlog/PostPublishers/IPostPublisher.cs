using System.Threading.Tasks;
using YogurtTheBlog.Enums;
using YogurtTheBlog.Models;

namespace YogurtTheBlog.PostPublishers {
    public interface IPostPublisher {
        PublisherType PublisherType { get; }
        Task<PublishResult> Publish(Post post);
    }
}