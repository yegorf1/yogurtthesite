using System.Collections.Generic;

namespace YogurtTheBlog.Models {
    public class Page<T> {
        public IEnumerable<T> Elements { get; set; }
        public long PagesCount { get; set; }
        public long PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}