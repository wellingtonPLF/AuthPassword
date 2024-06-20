import { invoke } from "@tauri-apps/api/tauri";

class PasswordService {
  
    constructor() {
    }

    async authenticate(email: string, password: string): Promise<string> {
      try{
        return await invoke("authenticate", { authentication: password + email });
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    async create_domain(content: string): Promise<string> {
      try{
        const directory = content.split(".");
        return await invoke("create_domain", { directory: directory[0].split("://")[1], content });
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    async get_all_domain(): Promise<string> {
      try{
        return await invoke("get_all_domain", {});
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    async get_all_password(key_str: string, directory: string): Promise<string> {
      try{
        return await invoke("get_auth", { keyStr: key_str, directory });
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    // ------------------------------------------------------------------------------------------------------------------------
    
    async savePassword(key_str: string, directory: string, password: string) {
      try{
        return await invoke("save_password", { keyStr: key_str, directory, password });
      }
      catch(error: any) {
        return Promise.reject(error);
      }
    }

    async updatePassword(key_str: string, directory: string, index: number, password: string) {
      try{
          return await invoke("update_password", { keyStr: key_str, directory, index, password });
      }
      catch(error: any) {
          return Promise.reject(error);
      }
    }

    async deletePassword(name: string, index: number) {
      try{
          return await invoke("delete_password", { directory: name, index });
      }
      catch(error: any) {
          return Promise.reject(error);
      }
    }

    async deleteDomain(directory: string) {
      try{
          return await invoke("delete_domain", { directory });
      }
      catch(error: any) {
          return Promise.reject(error);
      }
    }
}

export default new PasswordService();
