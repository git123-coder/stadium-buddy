import gatesData from "@/data/gates.json";
import crowdData from "@/data/crowd.json";
import accessibilityData from "@/data/accessibility.json";
import transportData from "@/data/transport.json";
import sustainabilityData from "@/data/sustainability.json";
import emergencyData from "@/data/emergency.json";
import enTranslations from "@/data/translations/en.json";
import hiTranslations from "@/data/translations/hi.json";

import {
  Gate,
  CrowdData,
  AccessibilityData,
  TransportOption,
  SustainabilityOption,
  EmergencyData as EmergencyDataType,
} from "@/types/stadium";

/**
 * Retrieves the list of gates at the stadium.
 * @returns {Gate[]} Array of Gate objects.
 */
export function getGates(): Gate[] {
  return gatesData as Gate[];
}

/**
 * Retrieves simulated live crowd telemetry.
 * @returns {CrowdData[]} Array of CrowdData objects.
 */
export function getCrowdData(): CrowdData[] {
  return crowdData as CrowdData[];
}

/**
 * Retrieves accessibility facilities, routes, and services.
 * @returns {AccessibilityData} AccessibilityData object.
 */
export function getAccessibilityData(): AccessibilityData {
  return accessibilityData as unknown as AccessibilityData;
}

/**
 * Retrieves available transit routes and travel details.
 * @returns {TransportOption[]} Array of TransportOption objects.
 */
export function getTransportOptions(): TransportOption[] {
  return transportData as TransportOption[];
}

/**
 * Retrieves sustainability metrics for each transit mode.
 * @returns {SustainabilityOption[]} Array of SustainabilityOption objects.
 */
export function getSustainabilityData(): SustainabilityOption[] {
  return sustainabilityData as SustainabilityOption[];
}

/**
 * Retrieves emergency service desks, exit paths, and assembly guidelines.
 * @returns {EmergencyDataType} EmergencyData object.
 */
export function getEmergencyData(): EmergencyDataType {
  return emergencyData as unknown as EmergencyDataType;
}

/**
 * Retrieves translation dictionaries for UI localization.
 * @param {"en" | "hi"} language The target language code.
 * @returns {Record<string, string>} Mapping of translation keys to local strings.
 */
export function getTranslations(language: "en" | "hi"): Record<string, string> {
  if (language === "hi") {
    return hiTranslations;
  }
  return enTranslations;
}
