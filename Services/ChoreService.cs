using myChores.Models;
using myChores.Interface;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace myChores.Services;

public class ChoreService : IChoreService
{
    List<Chore> Chores;
    private string fileName = "Chore.json";
    public ChoreService(IWebHostEnvironment webHost)
    {
        this.fileName = Path.Combine(webHost.ContentRootPath, "Chore.json");

        using(var jsonFile = File.OpenText(fileName))
        {
            Chores = JsonSerializer.Deserialize<List<Chore>>(jsonFile.ReadToEnd(),
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }

    private void saveToFile()
    {
        File.WriteAllText(fileName, JsonSerializer.Serialize(Chores));
    }

    public List<Chore> GetAll(int userId)
    {
        if(userId == 0)
            return Chores;
        else{
            return Chores.Where(chore => chore.userId == userId).ToList();
        }
    }

    public Chore GetById(int id) 
    {
        return Chores.FirstOrDefault(p => p.Id == id);
    }

    public Chore GetById(int id, int userId) => Chores.FirstOrDefault(p => p.Id == id && p.userId == userId);

    public void Add(Chore newChore)
    {
        newChore.Id = Chores.Count()+1;
        Chores.Add(newChore);
        saveToFile();
    }
  
    public bool Update(int id, Chore newChore)
    {
        if (id != newChore.Id)
            return false;

        var index = Chores.FindIndex(p => p.Id == newChore.Id);
        if(index == -1)
            return false;

        Chores[index] = newChore;
        saveToFile();
        return true;
    }

      
    public void Delete(int id)
    {
       var chore = GetById(id);
       if(chore is null)
            return; 

        Chores.Remove(chore);
        saveToFile();
    }  

    public void DeleteByUserId(int userId)
    {
        Chores.RemoveAll(task => task.userId == userId);
    }

}

public static class ChoreUtils
{
    public static void AddChore(this IServiceCollection services)
    {
        services.AddSingleton<IChoreService, ChoreService>();
    }
}