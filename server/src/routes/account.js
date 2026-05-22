import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as accountService from "../services/accountService.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    res.json(await accountService.getAccountOverview(req));
  }),
);

router.patch(
  "/profile",
  asyncHandler(async (req, res) => {
    res.json(await accountService.updateMyProfile(req, req.body));
  }),
);

router.get(
  "/documents",
  asyncHandler(async (req, res) => {
    res.json(await accountService.listDocuments(req));
  }),
);

router.post(
  "/documents",
  asyncHandler(async (req, res) => {
    res.status(201).json(await accountService.createDocument(req, req.body));
  }),
);

router.patch(
  "/documents/:id",
  asyncHandler(async (req, res) => {
    res.json(await accountService.updateDocument(req, req.params.id, req.body));
  }),
);

router.delete(
  "/documents/:id",
  asyncHandler(async (req, res) => {
    res.json(await accountService.deleteDocument(req, req.params.id));
  }),
);

router.get(
  "/privacy",
  asyncHandler(async (req, res) => {
    res.json(await accountService.getPrivacy(req));
  }),
);

router.put(
  "/privacy",
  asyncHandler(async (req, res) => {
    res.json(await accountService.updatePrivacy(req, req.body));
  }),
);

router.get(
  "/support",
  asyncHandler(async (req, res) => {
    res.json(await accountService.listTickets(req));
  }),
);

router.post(
  "/support",
  asyncHandler(async (req, res) => {
    res.status(201).json(await accountService.createTicket(req, req.body));
  }),
);

router.patch(
  "/support/:id",
  asyncHandler(async (req, res) => {
    res.json(await accountService.updateTicket(req, req.params.id, req.body));
  }),
);

router.delete(
  "/support/:id",
  asyncHandler(async (req, res) => {
    res.json(await accountService.deleteTicket(req, req.params.id));
  }),
);

router.get(
  "/settings",
  asyncHandler(async (req, res) => {
    res.json(await accountService.getSettings(req));
  }),
);

router.put(
  "/settings",
  asyncHandler(async (req, res) => {
    res.json(await accountService.updateSettings(req, req.body));
  }),
);

export default router;
