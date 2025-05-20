import { useMemo } from "react";
import { SettingsType } from "../schema/settings";

export const useItemSettings = (settings: SettingsType[], keys: string[]) =>
  useMemo(
    () =>
      keys
        .map((key) =>
          settings.find(
            (setting) =>
              setting.key.localeCompare(key, undefined, {
                sensitivity: "base",
              }) === 0
          )
        )
        .filter((el) => el !== undefined),
    [settings, keys]
  );
