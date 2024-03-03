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

    public List<Chore> GetAll() => Chores;

    public Chore GetById(int id) 
    {
        return Chores.FirstOrDefault(p => p.Id == id);
    }

    public void Add(Chore newChore)
    {
        newChore.Id = Chores.Count()+1;
        Chores.Add(newChore);
        saveToFile();
    }
  
    public void Update(Chore newChore)
    {
        var index = Chores.FindIndex(p => p.Id == newChore.Id);
        if(index == -1)
            return;

        Chores[index] = newChore;
        saveToFile();
    }  

      
    public void Delete(int id)
    {
       var chore = GetById(id);
       if(chore is null)
            return; 

        Chores.Remove(chore);
        saveToFile();
    }  

}

public static class ChoreUtils
{
    public static void AddChore(this IServiceCollection services)
    {
        services.AddSingleton<IChoreService, ChoreService>();
    }
}