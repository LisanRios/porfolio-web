import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { config } from './config.js';
import { requireAdmin } from './middleware/requireAdmin.js';
import { createCvPdf } from './services/cvService.js';
import { createGoogleSheetsClient } from './services/googleSheetsClient.js';
import { PortfolioRepository } from './services/portfolioRepository.js';

const app = express();
const sheets = createGoogleSheetsClient();
const repository = new PortfolioRepository(sheets);

const projectSchema = z.object({
  id: z.string().trim().optional(),
  type: z.string().trim().min(1),
  name: z.string().trim().min(1),
  date: z.string().trim().min(1),
  image: z.string().trim().min(1),
  description: z.string().trim().min(1),
  link: z.string().trim().min(1),
  lenguaje: z.array(z.object({ name: z.string().trim().min(1) })).default([]),
});

const iconReferenceSchema = z.object({
  name: z.string().trim().optional(),
  icon: z.string().trim().optional(),
});

const workSchema = z.object({
  id: z.string().trim().optional(),
  type: z.string().trim().min(1),
  name: z.string().trim().min(1),
  dateInicio: z.string().trim().min(1),
  dateFin: z.string().trim().min(1),
  logo: z.string().trim().min(1),
  link: z.string().trim().min(1),
  description: z.array(z.object({ punto: z.string().trim().min(1) })).default([]),
  technologies: z.array(iconReferenceSchema).default([]),
});

const technologySchema = z.object({
  id: z.string().trim().optional(),
  icon: z.string().trim().min(1),
  name: z.string().trim().min(1),
  nivel: z.string().trim().min(1),
});

const educationSchema = z.object({
  id: z.string().trim().optional(),
  type: z.string().trim().min(1),
  name: z.string().trim().min(1),
  dateInicio: z.string().trim().min(1),
  dateFin: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido'));
    },
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/portfolio', async (_req, res, next) => {
  try {
    res.json(await repository.getPortfolio());
  } catch (error) {
    next(error);
  }
});

app.get('/auth/session', requireAdmin, (req, res) => {
  res.json({ ok: true, email: req.user.email });
});

app.post('/projects', requireAdmin, async (req, res, next) => {
  try {
    const project = projectSchema.parse(req.body);
    res.status(201).json(await repository.createProject(project));
  } catch (error) {
    next(error);
  }
});

app.put('/projects/:projectId', requireAdmin, async (req, res, next) => {
  try {
    const project = projectSchema.parse(req.body);
    res.json(await repository.updateProject(req.params.projectId, project));
  } catch (error) {
    next(error);
  }
});

app.delete('/projects/:projectId', requireAdmin, async (req, res, next) => {
  try {
    await repository.deleteProject(req.params.projectId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/work', requireAdmin, async (req, res, next) => {
  try {
    const work = workSchema.parse(req.body);
    res.status(201).json(await repository.createWork(work));
  } catch (error) {
    next(error);
  }
});

app.put('/work/:workId', requireAdmin, async (req, res, next) => {
  try {
    const work = workSchema.parse(req.body);
    res.json(await repository.updateWork(req.params.workId, work));
  } catch (error) {
    next(error);
  }
});

app.delete('/work/:workId', requireAdmin, async (req, res, next) => {
  try {
    await repository.deleteWork(req.params.workId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/technologies', requireAdmin, async (req, res, next) => {
  try {
    const technology = technologySchema.parse(req.body);
    res.status(201).json(await repository.createTechnology(technology));
  } catch (error) {
    next(error);
  }
});

app.put('/technologies/:technologyId', requireAdmin, async (req, res, next) => {
  try {
    const technology = technologySchema.parse(req.body);
    res.json(await repository.updateTechnology(req.params.technologyId, technology));
  } catch (error) {
    next(error);
  }
});

app.delete('/technologies/:technologyId', requireAdmin, async (req, res, next) => {
  try {
    await repository.deleteTechnology(req.params.technologyId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/education', requireAdmin, async (req, res, next) => {
  try {
    const education = educationSchema.parse(req.body);
    res.status(201).json(await repository.createEducation(education));
  } catch (error) {
    next(error);
  }
});

app.put('/education/:educationId', requireAdmin, async (req, res, next) => {
  try {
    const education = educationSchema.parse(req.body);
    res.json(await repository.updateEducation(req.params.educationId, education));
  } catch (error) {
    next(error);
  }
});

app.delete('/education/:educationId', requireAdmin, async (req, res, next) => {
  try {
    await repository.deleteEducation(req.params.educationId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/cv', requireAdmin, async (_req, res, next) => {
  try {
    const portfolio = await repository.getPortfolio();
    const pdf = await createCvPdf(portfolio);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Lisandro-Gabriel-Rios-De-Morla-CV.pdf"'
    );
    res.send(pdf);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: 'Datos invalidos',
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  res.status(error.status ?? 500).json({
    message: error.message ?? 'Error interno',
  });
});

app.listen(config.port, () => {
  console.log(`Portfolio API listening on http://localhost:${config.port}`);
});
