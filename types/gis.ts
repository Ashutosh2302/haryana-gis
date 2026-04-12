export type BasemapId = "street" | "satellite";

export type SurveyLayerId =
  | "forest"
  | "villages"
  | "pillars"
  | "villagePillars"
  | "admin";

export type LayerVisibility = Record<SurveyLayerId, boolean>;

export type PillarStatus = "Verified" | "Pending" | "Disputed";

export interface PillarProperties {
  id: string;
  village: string;
  district: string;
  survey_date: string;
  survey_no: string;
  status: PillarStatus;
  image_url: string;
}

export interface PillarFeature {
  type: "Feature";
  properties: PillarProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface PillarFeatureCollection {
  type: "FeatureCollection";
  features: PillarFeature[];
}

export interface ForestProperties {
  name: string;
  division: string;
  area_ha: number;
}

export interface VillageProperties {
  id: string;
  name: string;
  tehsil: string;
  district: string;
  area_ha: number;
  settlement_stage: string;
}

export interface VillageFeature {
  type: "Feature";
  properties: VillageProperties;
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
}

export interface VillageFeatureCollection {
  type: "FeatureCollection";
  features: VillageFeature[];
}

export interface VillagePillarProperties extends PillarProperties {
  boundary_type: "Village Boundary Pillar";
}

export interface VillagePillarFeature {
  type: "Feature";
  properties: VillagePillarProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface VillagePillarFeatureCollection {
  type: "FeatureCollection";
  features: VillagePillarFeature[];
}
