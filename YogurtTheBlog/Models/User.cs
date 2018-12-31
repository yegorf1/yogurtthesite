namespace YogurtTheBlog.Models {
    public class User {
        public string Username { get; set; }
        public bool IsAdmin { get; set; } = false;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}