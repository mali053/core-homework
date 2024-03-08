using myChores.Models;
namespace myChores.Interface;
// using system.Collections.Generic;

public interface IChoreService
{
    List<Chore> GetAll(int userId);

    Chore GetById(int id);

    Chore GetById(int id, int userId);

    void Add(Chore newChore);

    bool Update(int id, Chore newChore);

    void Delete(int id);
}