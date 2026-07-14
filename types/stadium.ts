export interface Gate {
  id: string;
  name: string;
  stadiumSectionServed: string;
  walkingTimeMinutes: number;
  estimatedWaitMinutes: number;
  crowdLevel: "Low" | "Medium" | "High";
  accessible: boolean;
  nearbyLandmarks: string[];
  alternativeGate: string;
}

export interface CrowdData {
  gateId: string;
  crowdLevel: "Low" | "Medium" | "High";
  estimatedWaitMinutes: number;
  lastUpdated: string;
}

export interface Elevator {
  id: string;
  location: string;
  servesSections: string[];
}

export interface WheelchairRoute {
  routeId: string;
  fromLocation: string;
  toLocation: string;
  description: string;
}

export interface AccessibleRestroom {
  id: string;
  location: string;
  hasChangingTable: boolean;
}

export interface MedicalStation {
  id: string;
  location: string;
  equipments: string[];
}

export interface AssistancePoint {
  id: string;
  location: string;
  services: string[];
}

export interface AccessibilityData {
  accessibleEntrances: string[];
  elevators: Elevator[];
  wheelchairRoutes: WheelchairRoute[];
  accessibleRestrooms: AccessibleRestroom[];
  medicalStations: MedicalStation[];
  assistancePoints: AssistancePoint[];
}

export interface TransportOption {
  name: string;
  estimatedTimeMinutes: number;
  estimatedCost: string;
  crowdLevel: string;
  availability: string;
  recommendedFor: string;
}

export interface SustainabilityOption {
  transportType: string;
  co2SavedKg: number;
  greenScore: number;
  environmentalImpact: string;
  recommendation: string;
}

export interface ContactInfo {
  location: string;
  contactNumber?: string;
  instructions?: string;
  procedure?: string;
}

export interface EmergencyData {
  medicalHelp: ContactInfo;
  security: ContactInfo;
  lostChildCenter: ContactInfo;
  emergencyExitLocations: string[];
  assemblyArea: string;
  emergencyPhone: string;
}

export type IntentType =
  | "gateRecommendation"
  | "crowdStatus"
  | "accessibility"
  | "transport"
  | "sustainability"
  | "emergency"
  | "unknown";

export interface IntentResult {
  intent: IntentType;
  confidence: number;
}

export interface RecommendationResponse {
  intent: IntentType;
  success: boolean;
  title: string;
  recommendation: string;
  explanation: string;
  metadata?: unknown;
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  timestamp: string | Date;
  text: string;
  title?: string;
  recommendation?: string;
  explanation?: string;
  source?: "gemini" | "engine";
}

