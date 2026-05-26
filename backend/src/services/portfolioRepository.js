import { config } from '../config.js';
import {
  isActive,
  makeId,
  parseJsonCell,
  rowsToObjects,
  stringifyJsonCell,
} from '../utils/sheetRows.js';

const RANGES = {
  profile: 'profile!A:B',
  projects: 'projects!A:I',
  work: 'work!A:J',
  technologies: 'technologies!A:E',
  education: 'education!A:G',
};

export class PortfolioRepository {
  constructor(sheets) {
    this.sheets = sheets;
    this.spreadsheetId = config.googleSheetId;
  }

  async getPortfolio() {
    const [profile, projects, work, technologies, education] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getWork(),
      this.getTechnologies(),
      this.getEducation(),
    ]);

    return {
      ...profile,
      project: projects,
      trabajo: work,
      tecnology: technologies,
      titule: education,
    };
  }

  async createProject(project) {
    const normalizedProject = this.normalizeProject(project);
    await this.ensureProjectIdIsAvailable(normalizedProject.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.projects,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.projectToRow(normalizedProject)],
      },
    });

    return normalizedProject;
  }

  async updateProject(projectId, project) {
    const existing = await this.findProjectRow(projectId);
    const normalizedProject = this.normalizeProject({
      ...project,
      id: existing.id,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `projects!A${existing.rowNumber}:I${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.projectToRow(normalizedProject)],
      },
    });

    return normalizedProject;
  }

  async deleteProject(projectId) {
    const existing = await this.findProjectRow(projectId);

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `projects!I${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createWork(work) {
    const normalizedWork = this.normalizeWork(work);
    await this.ensureIdIsAvailable(RANGES.work, normalizedWork.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.work,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.workToRow(normalizedWork)],
      },
    });

    return normalizedWork;
  }

  async updateWork(workId, work) {
    const existing = await this.findRowById(RANGES.work, workId, 'Trabajo no encontrado');
    const normalizedWork = this.normalizeWork({ ...work, id: existing.id });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `work!A${existing.rowNumber}:J${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.workToRow(normalizedWork)],
      },
    });

    return normalizedWork;
  }

  async deleteWork(workId) {
    const existing = await this.findRowById(RANGES.work, workId, 'Trabajo no encontrado');

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `work!J${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createTechnology(technology) {
    const normalizedTechnology = this.normalizeTechnology(technology);
    await this.ensureIdIsAvailable(RANGES.technologies, normalizedTechnology.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.technologies,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.technologyToRow(normalizedTechnology)],
      },
    });

    return normalizedTechnology;
  }

  async updateTechnology(technologyId, technology) {
    const existing = await this.findRowById(
      RANGES.technologies,
      technologyId,
      'Tecnologia no encontrada'
    );
    const normalizedTechnology = this.normalizeTechnology({
      ...technology,
      id: existing.id,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `technologies!A${existing.rowNumber}:E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.technologyToRow(normalizedTechnology)],
      },
    });

    return normalizedTechnology;
  }

  async deleteTechnology(technologyId) {
    const existing = await this.findRowById(
      RANGES.technologies,
      technologyId,
      'Tecnologia no encontrada'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `technologies!E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createEducation(education) {
    const normalizedEducation = this.normalizeEducation(education);
    await this.ensureIdIsAvailable(RANGES.education, normalizedEducation.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.education,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.educationToRow(normalizedEducation)],
      },
    });

    return normalizedEducation;
  }

  async updateEducation(educationId, education) {
    const existing = await this.findRowById(
      RANGES.education,
      educationId,
      'Educacion no encontrada'
    );
    const normalizedEducation = this.normalizeEducation({
      ...education,
      id: existing.id,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `education!A${existing.rowNumber}:G${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.educationToRow(normalizedEducation)],
      },
    });

    return normalizedEducation;
  }

  async deleteEducation(educationId) {
    const existing = await this.findRowById(
      RANGES.education,
      educationId,
      'Educacion no encontrada'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `education!G${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async getProfile() {
    const values = await this.getValues(RANGES.profile);

    return values.reduce((profile, row) => {
      const [key, value] = row;

      if (key) {
        profile[key] = value ?? '';
      }

      return profile;
    }, {});
  }

  async getProjects({ includeInactive = false } = {}) {
    const rows = rowsToObjects(await this.getValues(RANGES.projects));

    return rows
      .filter((row) => includeInactive || isActive(row.active))
      .map((row) => ({
        id: row.id,
        type: row.type,
        name: row.name,
        date: row.date,
        image: row.image,
        description: row.description,
        link: row.link,
        lenguaje: parseJsonCell(row.lenguaje_json, []),
      }));
  }

  async getWork() {
    const rows = rowsToObjects(await this.getValues(RANGES.work));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      type: row.type,
      name: row.name,
      dateInicio: row.dateInicio,
      dateFin: row.dateFin,
      logo: row.logo,
      link: row.link,
      description: parseJsonCell(row.description_json, []),
      technologies: parseJsonCell(row.technologies_json, []),
    }));
  }

  async getTechnologies() {
    const rows = rowsToObjects(await this.getValues(RANGES.technologies));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      icon: row.icon,
      name: row.name,
      nivel: row.nivel,
    }));
  }

  async getEducation() {
    const rows = rowsToObjects(await this.getValues(RANGES.education));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      type: row.type,
      name: row.name,
      dateInicio: row.dateInicio,
      dateFin: row.dateFin,
      description: row.description,
    }));
  }

  async getValues(range) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range,
    });

    return response.data.values ?? [];
  }

  async findProjectRow(projectId) {
    return this.findRowById(RANGES.projects, projectId, 'Proyecto no encontrado');
  }

  async ensureProjectIdIsAvailable(projectId) {
    return this.ensureIdIsAvailable(RANGES.projects, projectId);
  }

  async findRowById(range, id, message) {
    const rows = rowsToObjects(await this.getValues(range));
    const row = rows.find((item) => item.id === id && isActive(item.active));

    if (!row) {
      const error = new Error(message);
      error.status = 404;
      throw error;
    }

    return row;
  }

  async ensureIdIsAvailable(range, id) {
    const rows = rowsToObjects(await this.getValues(range));
    const exists = rows.some((item) => item.id === id && isActive(item.active));

    if (exists) {
      const error = new Error('Ya existe un registro con ese ID');
      error.status = 409;
      throw error;
    }
  }

  normalizeProject(project) {
    const id = project.id || makeId(project.name);

    return {
      id,
      type: project.type,
      name: project.name,
      date: project.date,
      image: project.image,
      description: project.description,
      link: project.link,
      lenguaje: project.lenguaje ?? [],
    };
  }

  projectToRow(project) {
    return [
      project.id,
      project.type,
      project.name,
      project.date,
      project.image,
      project.description,
      project.link,
      stringifyJsonCell(project.lenguaje),
      'TRUE',
    ];
  }

  normalizeWork(work) {
    const id = work.id || makeId(`${work.name}-${work.type}`);

    return {
      id,
      type: work.type,
      name: work.name,
      dateInicio: work.dateInicio,
      dateFin: work.dateFin,
      logo: work.logo,
      link: work.link,
      description: work.description ?? [],
      technologies: work.technologies ?? [],
    };
  }

  workToRow(work) {
    return [
      work.id,
      work.type,
      work.name,
      work.dateInicio,
      work.dateFin,
      work.logo,
      work.link,
      stringifyJsonCell(work.description),
      stringifyJsonCell(work.technologies),
      'TRUE',
    ];
  }

  normalizeTechnology(technology) {
    const id = technology.id || makeId(technology.name);

    return {
      id,
      icon: technology.icon,
      name: technology.name,
      nivel: technology.nivel,
    };
  }

  technologyToRow(technology) {
    return [
      technology.id,
      technology.icon,
      technology.name,
      technology.nivel,
      'TRUE',
    ];
  }

  normalizeEducation(education) {
    const id = education.id || makeId(`${education.name}-${education.type}`);

    return {
      id,
      type: education.type,
      name: education.name,
      dateInicio: education.dateInicio,
      dateFin: education.dateFin,
      description: education.description,
    };
  }

  educationToRow(education) {
    return [
      education.id,
      education.type,
      education.name,
      education.dateInicio,
      education.dateFin,
      education.description,
      'TRUE',
    ];
  }
}
