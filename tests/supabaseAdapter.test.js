import { describe, expect, it } from "vitest";
import { deserializeItem, serializeItem } from "../src/data/supabaseAdapter";

describe("adaptador Supabase", () => {
  it("mantiene los IDs estables y traduce un proyecto", () => {
    const project = {
      id: "p1",
      categoryId: "branding",
      title: "Proyecto",
      slug: "proyecto",
      cover: "/assets/portada.jpg",
      gallery: ["/assets/marca.jpg"],
      tags: ["marca"],
      services: ["Identidad"],
      year: "2026",
      status: "published",
      published: true,
      order: 2,
    };

    const row = serializeItem("projects", project);
    expect(row).toMatchObject({
      id: "p1",
      category_id: "branding",
      cover_url: "/assets/portada.jpg",
      project_year: "2026",
      sort_order: 2,
    });
    expect(deserializeItem("projects", row)).toMatchObject({
      id: "p1",
      categoryId: "branding",
      cover: "/assets/portada.jpg",
      year: "2026",
      order: 2,
    });
  });

  it("convierte consultas sin exponer notas en el formulario público", () => {
    const inquiry = {
      id: "4b49a8e8-6e9d-4c3a-841a-3159ea7440fb",
      serviceId: "s1",
      serviceName: "Branding",
      contact: { name: "Ana", email: "ana@example.com" },
      answers: { budget: "$300" },
      files: [],
      status: "new",
      createdAt: "2026-08-28T00:00:00.000Z",
    };

    expect(serializeItem("inquiries", inquiry)).toMatchObject({
      service_id: "s1",
      internal_notes: "",
      status: "new",
    });
  });
});
