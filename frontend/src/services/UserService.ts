import users from "../Data/user1";

export interface UserFE {
  id: number;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  address?: string;
  point: number;
  avatar?: string;
  birth: string;
  status: boolean;
  gender:string;
}

{/*tao do tre gia cho api gia*/}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

{/*lay tu db --> fe map lai cho dung voi hien thi trong giao dien*/}
const mapToFE = (u: any): UserFE => ({
  id: u.user_id,
  username: u.username,
  fullname: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
  email: u.email,
  phone: u.phone,
  birth: u.birth,
  point: u.point,
  status: u.status,
  firstname: u.first_name,
  lastname: u.last_name,
  gender: u.gender
});


{/*fe ---> db */}
const mapToDB = (u: UserFE, old: any) => {
  const [first, ...rest] = u.fullname.split(" ");

  return {
    ...old,
    user_id: u.id,
    username: u.username,
    first_name: first,
    last_name: rest.join(" "),
    email: u.email,
    phone: u.phone,
    birth: u.birth,
    point: u.point,
    updatedAt: new Date()
  };
};

export const UserService = {

  async getUserById(id: number): Promise<UserFE | null> {
    await delay(300);
{/* lau user theo id */}
    const user = users.find(u => u.user_id === id);
    if (!user) return null;
{/*tra ve fe*/}
    return mapToFE(user);
  },

  async updateUser(data: UserFE): Promise<UserFE> {
    await delay(300);
{/*cap nhat usser tim, tra ve db, ghi lai */}
    const index = users.findIndex(u => u.user_id === data.id);
    if (index === -1) throw new Error("User not found");

    const updated = mapToDB(data, users[index]);
    users[index] = updated;

    return mapToFE(updated);
  },


    async getAllUsers(): Promise<UserFE[]> {
      await delay(300);
{/*lay full user hien thi len bang*/}
      return users.map(mapToFE);
    }

};