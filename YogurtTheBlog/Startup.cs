using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Newtonsoft.Json.Serialization;
using YogurtTheBlog.Models;
using YogurtTheBlog.Repositories;

namespace YogurtTheBlog {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());;

            IConfigurationSection authSettingsSection = Configuration.GetSection("Auth");
            services.Configure<AuthSettings>(authSettingsSection);
            services.Configure<PublishSettings>("Publish", Configuration);

            var databaseSettings = Configuration.GetSection("Database").Get<DatabaseSettings>();
            services.AddSingleton(new MongoClient().GetDatabase(databaseSettings.Name));
            services.AddSingleton<PostsRepository>();
                
            
            var authSettings = authSettingsSection.Get<AuthSettings>();
            byte[] key = Encoding.ASCII.GetBytes(authSettings.Secret);
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = async context =>
                        {
                            var userService = context.HttpContext.RequestServices.GetRequiredService<IUsersRepository>();
                            string userId = context.Principal.Identity.Name;
                            User user = await userService.GetById(userId);
                            if (user == null)
                            {
                                context.Fail("Unauthorized");
                            }
                            else {
                                if (user.IsAdmin) {
                                    context.Principal.AddIdentity(new ClaimsIdentity (
                                        new[] {
                                            new Claim(ClaimTypes.Role, "Admin") 
                                        }
                                    ));
                                }
                            }
                        }
                    };
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
 
            services.AddSingleton<IUsersRepository, UsersRepository>();

            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }
            else {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            var camelCaseConventionPack = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConventionPack, type => true);

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();
            
            app.UseMvc();

            app.UseSpa(spa => {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment()) {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}