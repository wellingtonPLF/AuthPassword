import { invoke } from "@tauri-apps/api/tauri";

class PasswordService {
  
    constructor() {
    }

    async savePassword({ password }: any) {
      try{
        return await invoke("greet", { name: 'password' });
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    async updatePassword({ password }: any) {
        try{
            return await invoke("greet", { name: 'password' });
        }
        catch(error: any) {
            return Promise.reject(error);
        }
    }

    async deletePassword(id: any) {
        try{
            return await invoke("greet", { name: 'password' });
        }
        catch(error: any) {
            return Promise.reject(error);
        }
    }
}

export default new PasswordService();
