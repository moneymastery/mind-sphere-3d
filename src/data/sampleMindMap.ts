import { MindMapData } from "@/types/mindmap";

export const sampleMindMap: MindMapData = {
  title: "Soil Science",
  description: "Comprehensive study of soil composition, formation, and ecology",
  rootNode: {
    id: "root",
    label: "Soil Science",
    depth: 0,
    expanded: true,
    children: [
      {
        id: "formation",
        label: "Soil Formation",
        depth: 1,
        expanded: true,
        children: [
          {
            id: "parent-material",
            label: "Parent Material",
            description: "Original rock and mineral composition",
            depth: 2,
            children: [
              { id: "igneous", label: "Igneous Rocks", depth: 3 },
              { id: "sedimentary", label: "Sedimentary Rocks", depth: 3 },
              { id: "metamorphic", label: "Metamorphic Rocks", depth: 3 },
            ],
          },
          {
            id: "climate",
            label: "Climate",
            description: "Temperature and precipitation effects",
            depth: 2,
            children: [
              { id: "weathering", label: "Weathering", depth: 3 },
              { id: "erosion", label: "Erosion", depth: 3 },
            ],
          },
          {
            id: "biological",
            label: "Biological Factors",
            depth: 2,
            children: [
              { id: "organisms", label: "Microorganisms", depth: 3 },
              { id: "plants", label: "Plant Activity", depth: 3 },
            ],
          },
          {
            id: "time",
            label: "Time",
            description: "Duration of soil development",
            depth: 2,
          },
          {
            id: "topography",
            label: "Topography",
            depth: 2,
            children: [
              { id: "slope", label: "Slope Angle", depth: 3 },
              { id: "drainage", label: "Drainage Patterns", depth: 3 },
            ],
          },
        ],
      },
      {
        id: "properties",
        label: "Soil Properties",
        depth: 1,
        expanded: true,
        children: [
          {
            id: "physical",
            label: "Physical Properties",
            depth: 2,
            children: [
              { id: "texture", label: "Texture", depth: 3 },
              { id: "structure", label: "Structure", depth: 3 },
              { id: "porosity", label: "Porosity", depth: 3 },
            ],
          },
          {
            id: "chemical",
            label: "Chemical Properties",
            depth: 2,
            children: [
              { id: "ph", label: "pH Level", depth: 3 },
              { id: "nutrients", label: "Nutrient Content", depth: 3 },
              { id: "cec", label: "Cation Exchange", depth: 3 },
            ],
          },
          {
            id: "biological-props",
            label: "Biological Properties",
            depth: 2,
            children: [
              { id: "organic", label: "Organic Matter", depth: 3 },
              { id: "microbes", label: "Microbial Activity", depth: 3 },
            ],
          },
        ],
      },
      {
        id: "classification",
        label: "Soil Classification",
        depth: 1,
        children: [
          { id: "orders", label: "Soil Orders", depth: 2 },
          { id: "horizons", label: "Soil Horizons", depth: 2 },
          { id: "taxonomy", label: "Soil Taxonomy", depth: 2 },
        ],
      },
      {
        id: "management",
        label: "Soil Management",
        depth: 1,
        children: [
          {
            id: "conservation",
            label: "Conservation",
            depth: 2,
            children: [
              { id: "cover-crops", label: "Cover Crops", depth: 3 },
              { id: "terracing", label: "Terracing", depth: 3 },
            ],
          },
          {
            id: "fertility",
            label: "Fertility Management",
            depth: 2,
            children: [
              { id: "fertilizers", label: "Fertilizers", depth: 3 },
              { id: "composting", label: "Composting", depth: 3 },
            ],
          },
        ],
      },
    ],
  },
};
