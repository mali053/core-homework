using myChores.Models;
namespace myChores.Interface;
// using system.Collections.Generic;

public interface IChoreService
{
    List<Chore> GetAll();

    Chore GetById(int id);

    void Add(Chore newChore);

    void Update(Chore newChore);

    void Delete(int id);
}