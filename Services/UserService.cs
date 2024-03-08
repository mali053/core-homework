using myChores.Models;
using myChores.Interface;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace myChores.Services;

public class UserService : IUserService
{
    List<User> users;
    private string fileName = "User.json";
    public UserService(IWebHostEnvironment webHost)
    {
        this.fileName = Path.Combine(webHost.ContentRootPath, "User.json");

        using(var jsonFile = File.OpenText(fileName))
        {
            users = JsonSerializer.Deserialize<List<User>>(jsonFile.ReadToEnd(),
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }

    private void saveToFile()
    {
        File.WriteAllText(fileName, JsonSerializer.Serialize(users));
    }

    public List<User> GetAll() => users;

    public User GetById(int id) 
    {
        return users.FirstOrDefault(p => p.Id == id);
    }

    public void Add(User newUser)
    {
        newUser.Id = users.Count()+1;
        users.Add(newUser);
        saveToFile();
    }
  
    public void Update(User newUser)
    {
        var index = users.FindIndex(p => p.Id == newUser.Id);
        if(index == -1)
            return;

        users[index] = newUser;
        saveToFile();
    }  

      
    public void Delete(int id)
    {
       var user = GetById(id);
       if(user is null)
            return; 

        users.Remove(user);
        saveToFile();
    }  

    public int UserExists(string userName, string password)
    {
        var user = users.FirstOrDefault(user => user.Name == userName && user.password == password);
        if(user == default)
            return -1;
        return user.Id;
       
    }

}

public static class UserUtils
{
    public static void AddUser(this IServiceCollection services)
    {
        services.AddSingleton<IUserService, UserService>();
    }
}