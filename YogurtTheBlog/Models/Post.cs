using System;

namespace YogurtTheBlog.Models {
    public class Post {
        public string ConstantUrl { get; set; }
        public DateTime PublishDate { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Author { get; set; }
    }
}