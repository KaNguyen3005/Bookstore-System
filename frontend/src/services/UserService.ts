import users from "../Data/user1";

export interface UserFE {
  user_id: number;
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
  role_id: number;
}

{/*tao do tre gia cho api gia*/}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

{/*lay tu db --> fe map lai cho dung voi hien thi trong giao dien*/}
const mapToFE = (u: any): UserFE => ({
  user_id: u.user_id,
  username: u.username,
  fullname: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
  email: u.email,
  phone: u.phone,
  birth: u.birth,
  point: u.point,
  status: u.status,
  firstname: u.first_name,
  lastname: u.last_name,
  gender: u.gender,
  role_id: u.role_id
});


{/*fe ---> db */}
const mapToDB = (u: UserFE, old: any) => {
  const [first, ...rest] = u.fullname.split(" ");

  return {
    ...old,
    user_id: u.user_id,
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

    const user = users.find(u => u.user_id === id);
    if (!user) return null;

    return mapToFE(user);
  },

  async updateUser(data: UserFE): Promise<UserFE> {
    await delay(300);

    const index = users.findIndex(u => u.user_id === data.user_id);
    if (index === -1) throw new Error("User not found");

    const updated = mapToDB(data, users[index]);
    users[index] = updated;

    return mapToFE(updated);
  },

  async getUsersByRole(roleId: number): Promise<UserFE[]> {
    await delay(300);

    return users
      .filter(u => u.role_id === roleId)
      .map(mapToFE);
  },

  // ✅ FIX: login phải nằm trong object
  async login(account: string, password: string): Promise<UserFE | null> {
    await delay(300);

    const user = users.find(
      (u) =>
        (u.email === account ||
          u.phone === account ||
          u.username === account) &&
        u.password === password
    );

    if (!user) return null;

    return mapToFE(user);
  }
};