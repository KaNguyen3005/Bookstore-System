import { mockAddresses } from "../Data/address";

export class AddressService {

  static async getAll(user_id: number) {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(
          mockAddresses.filter(
            item => item.user_id === user_id && !item.deletedAt
          )
        );
      }, 300);
    });
  }

  static async create(data: any) {
    return new Promise((resolve) => {
      const newItem = {
        ...data,
        address_id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      };

      mockAddresses.push(newItem);
      resolve(newItem);
    });
  }

  static async update(id: number, data: any) {
    return new Promise((resolve) => {
      const index = mockAddresses.findIndex(
        item => item.address_id === id
      );

      if (index !== -1) {
            mockAddresses[index] = {
              ...mockAddresses[index],
              ...data,
              updatedAt: new Date().toISOString()
            };
      }

      resolve(mockAddresses[index]);
    });
  }

  static async remove(id: number) {
    return new Promise((resolve) => {
      const item = mockAddresses.find(
        i => i.address_id === id
      );

      if (item) {
        item.deletedAt = new Date().toISOString();
      }

      resolve(true);
    });
  }

  static async setDefault(id: number) {
    return new Promise((resolve) => {
      mockAddresses.forEach(item => {
        item.is_default = item.address_id === id;
      });

      resolve(true);
    });
  }
}