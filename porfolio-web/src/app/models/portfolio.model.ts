export interface PortfolioData {
  nombre: string;
  age: string;
  foto: string;
  position: string;
  ubication: string;
  project: Project[];
  tecnology: Technology[];
  titule: Education[];
  trabajo: WorkExperience[];
}

export interface Project {
  id?: string;
  type: string;
  name: string;
  date: string;
  image: string;
  description: string;
  link: string;
  lenguaje: IconReference[];
}

export interface Technology {
  id?: string;
  icon: string;
  name: string;
  nivel: string;
}

export interface Education {
  id?: string;
  type: string;
  name: string;
  dateInicio: string;
  dateFin: string;
  description: string;
}

export interface WorkExperience {
  id?: string;
  type: string;
  name: string;
  dateInicio: string;
  dateFin: string;
  logo: string;
  link: string;
  description: DescriptionPoint[];
  technologies?: IconReference[];
}

export interface DescriptionPoint {
  punto: string;
}

export interface IconReference {
  name?: string;
  icon?: string;
}
