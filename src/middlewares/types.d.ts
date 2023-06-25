import {
  AdminService,
  BaseAuthStore,
  CollectionService,
  SettingsService,
  FileService,
} from "pocketbase";

export interface pbMethods {
  baseUrl: string;
  lang: string;
  admins: AdminService;
  collections: CollectionService;
  files: FileService;
  settings: SettingsService;
}

export type pbUser = BaseAuthStore["model"];
