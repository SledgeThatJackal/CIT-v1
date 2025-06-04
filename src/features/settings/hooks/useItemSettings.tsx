import { useMemo } from "react";
import { SettingsType } from "../schema/settings";
import { useSettings } from "./useSettings";

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

export const useSpecificItemSettings = (key: string) =>
  useItemSettings(useSettings(), [key])[0]?.value;
