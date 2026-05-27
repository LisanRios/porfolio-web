export interface PortfolioData {
  nombre: string;
  age: string;
  foto: string;
  position: string;
  ubication: string;
  heroKicker?: string;
  heroSubtitle?: string;
  contactTitle?: string;
  copyrightName?: string;
  about?: string;
  project: Project[];
  tecnology: Technology[];
  titule: Education[];
  trabajo: WorkExperience[];
  certifications?: Certification[];
  organizations?: OrganizationLogo[];
  highlights?: PortfolioHighlight[];
  focusAreas?: FocusArea[];
  links?: PortfolioLink[];
}

export interface Project {
  id?: string;
  order?: number;
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
  order?: number;
  icon: string;
  name: string;
  nivel: string;
}

export interface Education {
  id?: string;
  order?: number;
  type: string;
  name: string;
  dateInicio: string;
  dateFin: string;
  description: string;
}

export interface WorkExperience {
  id?: string;
  order?: number;
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

export interface Certification {
  id?: string;
  order?: number;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  description: string;
  icon: string;
}

export interface OrganizationLogo {
  id?: string;
  order?: number;
  name: string;
  image: string;
  alt: string;
  link: string;
}

export interface PortfolioHighlight {
  id?: string;
  order?: number;
  value: string;
  label: string;
  icon: string;
}

export interface FocusArea {
  id?: string;
  order?: number;
  icon: string;
  title: string;
  description: string;
}

export interface PortfolioLink {
  id?: string;
  order?: number;
  label: string;
  url: string;
  icon: string;
  placement: string;
  downloadName?: string;
}
