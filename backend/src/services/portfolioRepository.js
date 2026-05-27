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
  certifications: 'certifications!A:H',
  organizations: 'organizations!A:F',
  highlights: 'highlights!A:E',
  focusAreas: 'focusAreas!A:E',
  links: 'links!A:G',
};

export class PortfolioRepository {
  constructor(sheets) {
    this.sheets = sheets;
    this.spreadsheetId = config.googleSheetId;
  }

  async getPortfolio() {
    const [
      profile,
      projects,
      work,
      technologies,
      education,
      certifications,
      organizations,
      highlights,
      focusAreas,
      links,
    ] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getWork(),
      this.getTechnologies(),
      this.getEducation(),
      this.getCertifications(),
      this.getOrganizations(),
      this.getHighlights(),
      this.getFocusAreas(),
      this.getLinks(),
    ]);

    return {
      ...profile,
      project: projects,
      trabajo: work,
      tecnology: technologies,
      titule: education,
      certifications,
      organizations,
      highlights,
      focusAreas,
      links,
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

  async createCertification(certification) {
    const normalizedCertification = this.normalizeCertification(certification);
    await this.ensureIdIsAvailable(RANGES.certifications, normalizedCertification.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.certifications,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.certificationToRow(normalizedCertification)],
      },
    });

    return normalizedCertification;
  }

  async updateCertification(certificationId, certification) {
    const existing = await this.findRowById(
      RANGES.certifications,
      certificationId,
      'Certificacion no encontrada'
    );
    const normalizedCertification = this.normalizeCertification({
      ...certification,
      id: existing.id,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `certifications!A${existing.rowNumber}:H${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.certificationToRow(normalizedCertification)],
      },
    });

    return normalizedCertification;
  }

  async deleteCertification(certificationId) {
    const existing = await this.findRowById(
      RANGES.certifications,
      certificationId,
      'Certificacion no encontrada'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `certifications!H${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createOrganization(organization) {
    const normalizedOrganization = this.normalizeOrganization(organization);
    await this.ensureIdIsAvailable(RANGES.organizations, normalizedOrganization.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.organizations,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.organizationToRow(normalizedOrganization)],
      },
    });

    return normalizedOrganization;
  }

  async updateOrganization(organizationId, organization) {
    const existing = await this.findRowById(
      RANGES.organizations,
      organizationId,
      'Organizacion no encontrada'
    );
    const normalizedOrganization = this.normalizeOrganization({
      ...organization,
      id: existing.id,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `organizations!A${existing.rowNumber}:F${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.organizationToRow(normalizedOrganization)],
      },
    });

    return normalizedOrganization;
  }

  async deleteOrganization(organizationId) {
    const existing = await this.findRowById(
      RANGES.organizations,
      organizationId,
      'Organizacion no encontrada'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `organizations!F${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createHighlight(highlight) {
    const normalizedHighlight = this.normalizeHighlight(highlight);
    await this.ensureIdIsAvailable(RANGES.highlights, normalizedHighlight.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.highlights,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.highlightToRow(normalizedHighlight)],
      },
    });

    return normalizedHighlight;
  }

  async updateHighlight(highlightId, highlight) {
    const existing = await this.findRowById(
      RANGES.highlights,
      highlightId,
      'Indicador no encontrado'
    );
    const normalizedHighlight = this.normalizeHighlight({ ...highlight, id: existing.id });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `highlights!A${existing.rowNumber}:E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.highlightToRow(normalizedHighlight)],
      },
    });

    return normalizedHighlight;
  }

  async deleteHighlight(highlightId) {
    const existing = await this.findRowById(
      RANGES.highlights,
      highlightId,
      'Indicador no encontrado'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `highlights!E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createFocusArea(focusArea) {
    const normalizedFocusArea = this.normalizeFocusArea(focusArea);
    await this.ensureIdIsAvailable(RANGES.focusAreas, normalizedFocusArea.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.focusAreas,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.focusAreaToRow(normalizedFocusArea)],
      },
    });

    return normalizedFocusArea;
  }

  async updateFocusArea(focusAreaId, focusArea) {
    const existing = await this.findRowById(
      RANGES.focusAreas,
      focusAreaId,
      'Area de foco no encontrada'
    );
    const normalizedFocusArea = this.normalizeFocusArea({ ...focusArea, id: existing.id });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `focusAreas!A${existing.rowNumber}:E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.focusAreaToRow(normalizedFocusArea)],
      },
    });

    return normalizedFocusArea;
  }

  async deleteFocusArea(focusAreaId) {
    const existing = await this.findRowById(
      RANGES.focusAreas,
      focusAreaId,
      'Area de foco no encontrada'
    );

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `focusAreas!E${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async createLink(link) {
    const normalizedLink = this.normalizeLink(link);
    await this.ensureIdIsAvailable(RANGES.links, normalizedLink.id);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: RANGES.links,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [this.linkToRow(normalizedLink)],
      },
    });

    return normalizedLink;
  }

  async updateLink(linkId, link) {
    const existing = await this.findRowById(RANGES.links, linkId, 'Enlace no encontrado');
    const normalizedLink = this.normalizeLink({ ...link, id: existing.id });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `links!A${existing.rowNumber}:G${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.linkToRow(normalizedLink)],
      },
    });

    return normalizedLink;
  }

  async deleteLink(linkId) {
    const existing = await this.findRowById(RANGES.links, linkId, 'Enlace no encontrado');

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `links!G${existing.rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['FALSE']],
      },
    });
  }

  async updateProfileValue(key, value) {
    const values = await this.getValues(RANGES.profile);
    const rowIndex = values.findIndex((row, index) => index > 0 && row[0] === key);
    const rowNumber = rowIndex >= 0 ? rowIndex + 1 : null;

    if (rowNumber) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `profile!A${rowNumber}:B${rowNumber}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[key, value]],
        },
      });
    } else {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: RANGES.profile,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[key, value]],
        },
      });
    }

    return { key, value };
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

  async getCertifications() {
    const rows = rowsToObjects(await this.getValues(RANGES.certifications));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      date: row.date,
      credentialUrl: row.credentialUrl,
      description: row.description,
      icon: row.icon,
    }));
  }

  async getOrganizations() {
    const rows = rowsToObjects(await this.getValues(RANGES.organizations));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      name: row.name,
      image: row.image,
      alt: row.alt,
      link: row.link,
    }));
  }

  async getHighlights() {
    const rows = rowsToObjects(await this.getValues(RANGES.highlights));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      value: row.value,
      label: row.label,
      icon: row.icon,
    }));
  }

  async getFocusAreas() {
    const rows = rowsToObjects(await this.getValues(RANGES.focusAreas));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      icon: row.icon,
      title: row.title,
      description: row.description,
    }));
  }

  async getLinks() {
    const rows = rowsToObjects(await this.getValues(RANGES.links));

    return rows.filter((row) => isActive(row.active)).map((row) => ({
      id: row.id,
      label: row.label,
      url: row.url,
      icon: row.icon,
      placement: row.placement,
      downloadName: row.downloadName,
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

  normalizeCertification(certification) {
    const id = certification.id || makeId(`${certification.issuer}-${certification.title}`);

    return {
      id,
      title: certification.title,
      issuer: certification.issuer,
      date: certification.date,
      credentialUrl: certification.credentialUrl,
      description: certification.description,
      icon: certification.icon,
    };
  }

  certificationToRow(certification) {
    return [
      certification.id,
      certification.title,
      certification.issuer,
      certification.date,
      certification.credentialUrl,
      certification.description,
      certification.icon,
      'TRUE',
    ];
  }

  normalizeOrganization(organization) {
    const id = organization.id || makeId(organization.name);

    return {
      id,
      name: organization.name,
      image: organization.image,
      alt: organization.alt,
      link: organization.link ?? '',
    };
  }

  organizationToRow(organization) {
    return [
      organization.id,
      organization.name,
      organization.image,
      organization.alt,
      organization.link,
      'TRUE',
    ];
  }

  normalizeHighlight(highlight) {
    const id = highlight.id || makeId(highlight.label);

    return {
      id,
      value: highlight.value,
      label: highlight.label,
      icon: highlight.icon,
    };
  }

  highlightToRow(highlight) {
    return [
      highlight.id,
      highlight.value,
      highlight.label,
      highlight.icon,
      'TRUE',
    ];
  }

  normalizeFocusArea(focusArea) {
    const id = focusArea.id || makeId(focusArea.title);

    return {
      id,
      icon: focusArea.icon,
      title: focusArea.title,
      description: focusArea.description,
    };
  }

  focusAreaToRow(focusArea) {
    return [
      focusArea.id,
      focusArea.icon,
      focusArea.title,
      focusArea.description,
      'TRUE',
    ];
  }

  normalizeLink(link) {
    const id = link.id || makeId(`${link.placement}-${link.label}`);

    return {
      id,
      label: link.label,
      url: link.url,
      icon: link.icon,
      placement: link.placement,
      downloadName: link.downloadName ?? '',
    };
  }

  linkToRow(link) {
    return [
      link.id,
      link.label,
      link.url,
      link.icon,
      link.placement,
      link.downloadName,
      'TRUE',
    ];
  }
}
