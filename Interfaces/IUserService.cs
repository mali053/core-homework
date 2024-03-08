using myChores.Models;
namespace myChores.Interface;

public interface IUserService
{
    List<User> GetAll();

    User GetById(int id);

    void Add(User newUser);

    void Update(User newUser);

    void Delete(int id);
    int UserExists(string userName, string password);
}