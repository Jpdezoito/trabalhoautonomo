/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL nao foi configurada para o seed.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 10);

  await prisma.passwordRecoveryAttemptLog.deleteMany();
  await prisma.passwordRecoverySession.deleteMany();
  await prisma.trustVerificationRequest.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.moderationReport.deleteMany();
  await prisma.facialEnrollment.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.adminLog.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.review.deleteMany();
  await prisma.quoteMessage.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.workerServiceArea.deleteMany();
  await prisma.workerService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.neighborhood.deleteMany();
  await prisma.city.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const saoPaulo = await prisma.city.create({
    data: { name: "Sao Paulo", state: "Sao Paulo", stateCode: "SP", slug: "sao-paulo" },
  });
  const osasco = await prisma.city.create({
    data: { name: "Osasco", state: "Sao Paulo", stateCode: "SP", slug: "osasco" },
  });

  const neighborhoods = await Promise.all([
    prisma.neighborhood.create({ data: { cityId: saoPaulo.id, name: "Tatuape", slug: "tatuape" } }),
    prisma.neighborhood.create({ data: { cityId: saoPaulo.id, name: "Pinheiros", slug: "pinheiros" } }),
    prisma.neighborhood.create({ data: { cityId: saoPaulo.id, name: "Vila Mariana", slug: "vila-mariana" } }),
    prisma.neighborhood.create({ data: { cityId: saoPaulo.id, name: "Mooca", slug: "mooca" } }),
    prisma.neighborhood.create({ data: { cityId: osasco.id, name: "Centro", slug: "centro" } }),
  ]);

  const neighborhoodMap = Object.fromEntries(neighborhoods.map((item) => [item.slug, item]));

  const categorias = {
    eletricistas: await prisma.category.create({
      data: {
        name: "Eletricistas",
        slug: "eletricistas",
        description: "Instalacoes, quadros, manutencao e emergencia eletrica.",
        group: "Servicos tecnicos",
        icon: "PlugZap",
        sortOrder: 1,
      },
    }),
    reformas: await prisma.category.create({
      data: {
        name: "Reformas",
        slug: "reformas",
        description: "Reformas residenciais, acabamentos e coordenacao de obra.",
        group: "Construcao e reformas",
        icon: "Hammer",
        sortOrder: 2,
      },
    }),
    frete: await prisma.category.create({
      data: {
        name: "Frete",
        slug: "frete",
        description: "Fretes locais, carretos e pequenos transportes.",
        group: "Transporte e entregas",
        icon: "Truck",
        sortOrder: 3,
      },
    }),
    limpeza: await prisma.category.create({
      data: {
        name: "Limpeza",
        slug: "limpeza",
        description: "Limpeza residencial, pos-obra e organizacao.",
        group: "Limpeza e cuidados",
        icon: "Sparkles",
        sortOrder: 4,
      },
    }),
  };

  const subcategorias = {
    motoboy: await prisma.category.create({
      data: {
        parentId: categorias.frete.id,
        name: "Motoboy",
        slug: "motoboy",
        description: "Coletas e entregas urbanas com agilidade.",
        group: "Transporte e entregas",
        icon: "Bike",
        sortOrder: 10,
      },
    }),
    carreto: await prisma.category.create({
      data: {
        parentId: categorias.frete.id,
        name: "Carreto",
        slug: "carreto",
        description: "Carretos rapidos para pequenas cargas.",
        group: "Transporte e entregas",
        icon: "Truck",
        sortOrder: 11,
      },
    }),
    fazTudo: await prisma.category.create({
      data: {
        parentId: categorias.limpeza.id,
        name: "Faz-tudo",
        slug: "faz-tudo",
        description: "Apoio geral em manutencao leve e organizacao.",
        group: "Casa e manutencao",
        icon: "Hammer",
        sortOrder: 12,
      },
    }),
  };

  const services = {
    quadroEletrico: await prisma.service.create({
      data: {
        categoryId: categorias.eletricistas.id,
        name: "Troca de quadro eletrico",
        slug: "troca-de-quadro-eletrico",
        description: "Substituicao, revisao e modernizacao de quadro de energia.",
      },
    }),
    tomadas: await prisma.service.create({
      data: {
        categoryId: categorias.eletricistas.id,
        name: "Instalacao de tomadas",
        slug: "instalacao-de-tomadas",
        description: "Novos pontos, troca de tomadas e revisao de circuito.",
      },
    }),
    reformaBanheiro: await prisma.service.create({
      data: {
        categoryId: categorias.reformas.id,
        name: "Reforma de banheiro",
        slug: "reforma-de-banheiro",
        description: "Reforma completa com acabamento, metais e revestimentos.",
      },
    }),
    freteLocal: await prisma.service.create({
      data: {
        categoryId: categorias.frete.id,
        name: "Frete local",
        slug: "frete-local",
        description: "Transporte de moveis e volumes em percursos urbanos.",
      },
    }),
    motofrete: await prisma.service.create({
      data: {
        categoryId: subcategorias.motoboy.id,
        name: "Motofrete expresso",
        slug: "motofrete-expresso",
        description: "Entrega rapida de documentos e pequenos pacotes.",
      },
    }),
    limpezaResidencial: await prisma.service.create({
      data: {
        categoryId: categorias.limpeza.id,
        name: "Limpeza residencial",
        slug: "limpeza-residencial",
        description: "Limpeza por diaria, recorrencia ou pos-obra leve.",
      },
    }),
  };

  const adminUser = await prisma.user.create({
    data: {
      name: "Equipe Operacional",
      email: "admin@autonomopro.com.br",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "(11) 4000-1000",
      facialRecoveryEnabled: false,
      adminProfile: {
        create: {
          title: "Administrador de plataforma",
          permissions: ["users.read", "profiles.review", "reviews.moderate", "settings.write"],
        },
      },
    },
  });

  const clientOneUser = await prisma.user.create({
    data: {
      name: "Mariana Almeida",
      email: "mariana@email.com",
      passwordHash,
      role: "CLIENT",
      status: "ACTIVE",
      phone: "(11) 99999-2020",
      facialRecoveryEnabled: false,
      clientProfile: {
        create: {
          cityId: saoPaulo.id,
          neighborhoodId: neighborhoodMap["tatuape"].id,
          addressNote: "Apartamento residencial no Tatuape.",
        },
      },
    },
    include: { clientProfile: true },
  });

  const clientTwoUser = await prisma.user.create({
    data: {
      name: "Paulo Cesar",
      email: "paulo@email.com",
      passwordHash,
      role: "CLIENT",
      status: "ACTIVE",
      phone: "(11) 99999-3030",
      facialRecoveryEnabled: true,
      facialRecoveryEnabledAt: new Date(),
      clientProfile: {
        create: {
          cityId: saoPaulo.id,
          neighborhoodId: neighborhoodMap["pinheiros"].id,
          addressNote: "Cliente com foco em reformas residenciais.",
        },
      },
    },
    include: { clientProfile: true },
  });

  const workerOneUser = await prisma.user.create({
    data: {
      name: "Carlos Mendes",
      email: "carlos@email.com",
      passwordHash,
      role: "WORKER",
      status: "ACTIVE",
      phone: "(11) 3333-1001",
      facialRecoveryEnabled: true,
      facialRecoveryEnabledAt: new Date(),
      workerProfile: {
        create: {
          slug: "carlos-mendes-eletricista",
          publicName: "Carlos Mendes",
          headline: "Eletricista residencial e predial com foco em seguranca e rapidez.",
          bio: "Atendo instalacoes, revisoes e correcoes eletricas em residencias, condominios e pequenos negocios.",
          cityId: saoPaulo.id,
          neighborhoodId: neighborhoodMap["tatuape"].id,
          serviceRadiusKm: 18,
          yearsExperience: 12,
          basePriceDescription: "Visita tecnica a partir de R$ 90",
          whatsapp: "+5511999991001",
          websiteUrl: "https://autonomopro.local/carlos-mendes",
          isAvailable: true,
          approvalStatus: "APPROVED",
          verificationStatus: "APPROVED",
          approvedAt: new Date(),
          averageRating: "4.90",
          reviewsCount: 2,
          jobsCompleted: 312,
        },
      },
    },
    include: { workerProfile: true },
  });

  const workerTwoUser = await prisma.user.create({
    data: {
      name: "Fernanda Rocha",
      email: "fernanda@email.com",
      passwordHash,
      role: "WORKER",
      status: "ACTIVE",
      phone: "(11) 3333-1002",
      facialRecoveryEnabled: true,
      facialRecoveryEnabledAt: new Date(),
      workerProfile: {
        create: {
          slug: "fernanda-rocha-reformas",
          publicName: "Fernanda Rocha",
          headline: "Reformas com cronograma, organizacao de obra e acabamento fino.",
          bio: "Coordeno equipes para reforma de ambientes residenciais, banheiros, cozinhas e acabamentos completos.",
          cityId: saoPaulo.id,
          neighborhoodId: neighborhoodMap["pinheiros"].id,
          serviceRadiusKm: 20,
          yearsExperience: 9,
          basePriceDescription: "Orcamento tecnico sob visita",
          whatsapp: "+5511999991002",
          websiteUrl: "https://autonomopro.local/fernanda-rocha",
          isAvailable: true,
          approvalStatus: "APPROVED",
          verificationStatus: "APPROVED",
          approvedAt: new Date(),
          averageRating: "4.80",
          reviewsCount: 1,
          jobsCompleted: 148,
        },
      },
    },
    include: { workerProfile: true },
  });

  const workerThreeUser = await prisma.user.create({
    data: {
      name: "Rafael Oliveira",
      email: "rafael@email.com",
      passwordHash,
      role: "WORKER",
      status: "ACTIVE",
      phone: "(11) 3333-1004",
      facialRecoveryEnabled: false,
      workerProfile: {
        create: {
          slug: "rafael-oliveira-frete-mudancas",
          publicName: "Rafael Oliveira",
          headline: "Frete, carreto e pequenas mudancas com cuidado no transporte.",
          bio: "Atendo pequenas mudancas, transporte de moveis, eletrodomesticos e carretos urbanos com ajudante sob combinacao.",
          cityId: saoPaulo.id,
          neighborhoodId: neighborhoodMap["mooca"].id,
          serviceRadiusKm: 25,
          yearsExperience: 7,
          basePriceDescription: "Fretes a partir de R$ 120",
          whatsapp: "+5511999991004",
          websiteUrl: "https://autonomopro.local/rafael-oliveira",
          isAvailable: true,
          approvalStatus: "PENDING_REVIEW",
          verificationStatus: "PENDING",
          averageRating: "4.70",
          reviewsCount: 1,
          jobsCompleted: 176,
        },
      },
    },
    include: { workerProfile: true },
  });

  const workerProfiles = {
    carlos: workerOneUser.workerProfile,
    fernanda: workerTwoUser.workerProfile,
    rafael: workerThreeUser.workerProfile,
  };

  await prisma.workerService.createMany({
    data: [
      { workerProfileId: workerProfiles.carlos.id, serviceId: services.quadroEletrico.id, priceFrom: "90", isPrimary: true },
      { workerProfileId: workerProfiles.carlos.id, serviceId: services.tomadas.id, priceFrom: "70", isPrimary: false },
      { workerProfileId: workerProfiles.fernanda.id, serviceId: services.reformaBanheiro.id, priceFrom: "8900", isPrimary: true },
      { workerProfileId: workerProfiles.rafael.id, serviceId: services.freteLocal.id, priceFrom: "120", isPrimary: true },
      { workerProfileId: workerProfiles.rafael.id, serviceId: services.motofrete.id, priceFrom: "30", isPrimary: false },
    ],
  });

  await prisma.workerServiceArea.createMany({
    data: [
      { workerProfileId: workerProfiles.carlos.id, cityId: saoPaulo.id, neighborhoodId: neighborhoodMap["tatuape"].id, travelFee: "0" },
      { workerProfileId: workerProfiles.carlos.id, cityId: saoPaulo.id, neighborhoodId: neighborhoodMap["mooca"].id, travelFee: "25" },
      { workerProfileId: workerProfiles.fernanda.id, cityId: saoPaulo.id, neighborhoodId: neighborhoodMap["pinheiros"].id, travelFee: "0" },
      { workerProfileId: workerProfiles.fernanda.id, cityId: saoPaulo.id, neighborhoodId: neighborhoodMap["vila-mariana"].id, travelFee: "35" },
      { workerProfileId: workerProfiles.rafael.id, cityId: saoPaulo.id, neighborhoodId: neighborhoodMap["mooca"].id, travelFee: "0" },
      { workerProfileId: workerProfiles.rafael.id, cityId: osasco.id, neighborhoodId: neighborhoodMap["centro"].id, travelFee: "45" },
    ],
  });

  await prisma.portfolioImage.createMany({
    data: [
      {
        workerProfileId: workerProfiles.carlos.id,
        title: "Modernizacao de quadro eletrico",
        description: "Troca de disjuntores e reorganizacao segura dos circuitos.",
        imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
        altText: "Quadro eletrico revisado",
        sortOrder: 0,
        isCover: true,
        status: "PUBLISHED",
        cityId: saoPaulo.id,
      },
      {
        workerProfileId: workerProfiles.fernanda.id,
        title: "Banheiro completo em 18 dias",
        description: "Demolicao, impermeabilizacao, revestimentos e metais.",
        imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
        altText: "Banheiro reformado",
        sortOrder: 0,
        isCover: true,
        status: "PUBLISHED",
        cityId: saoPaulo.id,
      },
      {
        workerProfileId: workerProfiles.rafael.id,
        title: "Frete de sofa e rack",
        description: "Transporte local com protecao e entrega no mesmo dia.",
        imageUrl: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=900&q=80",
        altText: "Frete de moveis",
        sortOrder: 0,
        isCover: true,
        status: "PUBLISHED",
        cityId: saoPaulo.id,
      },
    ],
  });

  const quoteOne = await prisma.quoteRequest.create({
    data: {
      code: "ORC-2001",
      clientProfileId: clientOneUser.clientProfile.id,
      workerProfileId: workerProfiles.carlos.id,
      serviceId: services.quadroEletrico.id,
      cityId: saoPaulo.id,
      neighborhoodId: neighborhoodMap["tatuape"].id,
      title: "Troca de quadro eletrico",
      description: "Preciso revisar e trocar o quadro do apartamento por seguranca.",
      budgetMin: "300",
      budgetMax: "900",
      status: "COMPLETED",
      priority: "HIGH",
      completedAt: new Date("2026-04-10T15:00:00.000Z"),
    },
  });

  const quoteTwo = await prisma.quoteRequest.create({
    data: {
      code: "ORC-2002",
      clientProfileId: clientTwoUser.clientProfile.id,
      workerProfileId: workerProfiles.fernanda.id,
      serviceId: services.reformaBanheiro.id,
      cityId: saoPaulo.id,
      neighborhoodId: neighborhoodMap["pinheiros"].id,
      title: "Reforma de banheiro social",
      description: "Gostaria de reformar o banheiro com novo piso, nicho e metais.",
      budgetMin: "7000",
      budgetMax: "12000",
      quotedAmount: "8900",
      status: "QUOTED",
      priority: "NORMAL",
    },
  });

  const quoteThree = await prisma.quoteRequest.create({
    data: {
      code: "ORC-2003",
      clientProfileId: clientOneUser.clientProfile.id,
      workerProfileId: workerProfiles.rafael.id,
      serviceId: services.freteLocal.id,
      cityId: saoPaulo.id,
      neighborhoodId: neighborhoodMap["mooca"].id,
      title: "Frete de moveis pequenos",
      description: "Levar sofa, rack e duas cadeiras da Mooca para Osasco.",
      budgetMin: "120",
      budgetMax: "260",
      status: "OPEN",
      priority: "NORMAL",
    },
  });

  await prisma.quoteMessage.createMany({
    data: [
      {
        quoteRequestId: quoteOne.id,
        senderId: clientOneUser.id,
        body: "Enviei fotos do quadro e da entrada do apartamento.",
      },
      {
        quoteRequestId: quoteTwo.id,
        senderId: workerTwoUser.id,
        body: "Posso fazer a visita tecnica na quinta-feira de manha.",
      },
      {
        quoteRequestId: quoteThree.id,
        senderId: clientOneUser.id,
        body: "Consigo ajudar no carregamento de parte dos itens.",
      },
    ],
  });

  const reviewOne = await prisma.review.create({
    data: {
      workerProfileId: workerProfiles.carlos.id,
      clientProfileId: clientOneUser.clientProfile.id,
      quoteRequestId: quoteOne.id,
      rating: 5,
      title: "Servico limpo e pontual",
      comment: "Chegou no horario, explicou o problema e deixou tudo funcionando com seguranca.",
      status: "PUBLISHED",
    },
  });

  const reviewTwo = await prisma.review.create({
    data: {
      workerProfileId: workerProfiles.carlos.id,
      clientProfileId: clientTwoUser.clientProfile.id,
      rating: 4,
      title: "Boa comunicacao",
      comment: "Foi transparente no diagnostico e no custo dos materiais.",
      status: "PUBLISHED",
    },
  });

  const reviewThree = await prisma.review.create({
    data: {
      workerProfileId: workerProfiles.fernanda.id,
      clientProfileId: clientTwoUser.clientProfile.id,
      quoteRequestId: quoteTwo.id,
      rating: 5,
      title: "Obra organizada",
      comment: "A reforma seguiu cronograma e o acabamento ficou excelente.",
      status: "PENDING",
    },
  });

  await prisma.favorite.createMany({
    data: [
      { clientProfileId: clientOneUser.clientProfile.id, workerProfileId: workerProfiles.carlos.id },
      { clientProfileId: clientOneUser.clientProfile.id, workerProfileId: workerProfiles.rafael.id },
      { clientProfileId: clientTwoUser.clientProfile.id, workerProfileId: workerProfiles.fernanda.id },
    ],
  });

  await prisma.contactRequest.createMany({
    data: [
      {
        clientProfileId: clientOneUser.clientProfile.id,
        workerProfileId: workerProfiles.carlos.id,
        serviceId: services.tomadas.id,
        cityId: saoPaulo.id,
        neighborhoodId: neighborhoodMap["tatuape"].id,
        channel: "WHATSAPP",
        status: "CONTACTED",
        name: "Mariana Almeida",
        email: "mariana@email.com",
        phone: "(11) 99999-2020",
        message: "Quero instalar duas tomadas novas na sala.",
      },
      {
        clientProfileId: clientTwoUser.clientProfile.id,
        workerProfileId: workerProfiles.fernanda.id,
        serviceId: services.reformaBanheiro.id,
        cityId: saoPaulo.id,
        neighborhoodId: neighborhoodMap["pinheiros"].id,
        channel: "PLATFORM",
        status: "NEW",
        name: "Paulo Cesar",
        email: "paulo@email.com",
        phone: "(11) 99999-3030",
        message: "Gostaria de entender prazo medio e etapas da reforma.",
      },
    ],
  });

  await prisma.verificationRequest.createMany({
    data: [
      {
        workerProfileId: workerProfiles.carlos.id,
        status: "APPROVED",
        documentType: "CPF e comprovante de endereco",
        documentUrl: "https://autonomopro.local/docs/carlos.pdf",
        reviewedAt: new Date(),
      },
      {
        workerProfileId: workerProfiles.rafael.id,
        status: "PENDING",
        documentType: "CNH e comprovante de atividade",
        documentUrl: "https://autonomopro.local/docs/rafael.pdf",
      },
    ],
  });

  await prisma.facialEnrollment.createMany({
    data: [
      {
        userId: workerOneUser.id,
        status: "APPROVED",
        captureSource: "WEBCAM",
        provider: "internal-v1",
        storageKey: "facial-enrollments/carlos/approved-001",
        metadata: { mimeType: "image/jpeg", byteSizeEstimate: 182000 },
        consentAcceptedAt: new Date("2026-04-14T10:00:00.000Z"),
        submittedAt: new Date("2026-04-14T10:02:00.000Z"),
        reviewedAt: new Date("2026-04-14T14:15:00.000Z"),
        approvedAt: new Date("2026-04-14T14:15:00.000Z"),
        retryCount: 0,
        usableForPasswordRecovery: true,
        reviewedById: adminUser.id,
        reviewNotes: "Captura facial valida e consistente com os dados da conta.",
      },
      {
        userId: workerThreeUser.id,
        status: "IN_REVIEW",
        captureSource: "UPLOAD",
        provider: "internal-v1",
        storageKey: "facial-enrollments/rafael/review-001",
        metadata: { mimeType: "image/jpeg", byteSizeEstimate: 194000 },
        consentAcceptedAt: new Date("2026-04-19T09:10:00.000Z"),
        submittedAt: new Date("2026-04-19T09:12:00.000Z"),
        retryCount: 1,
        usableForPasswordRecovery: false,
      },
      {
        userId: clientTwoUser.id,
        status: "APPROVED",
        captureSource: "WEBCAM",
        provider: "internal-v1",
        storageKey: "facial-enrollments/paulo/approved-001",
        metadata: { mimeType: "image/jpeg", byteSizeEstimate: 165000 },
        consentAcceptedAt: new Date("2026-04-18T11:20:00.000Z"),
        submittedAt: new Date("2026-04-18T11:21:00.000Z"),
        reviewedAt: new Date("2026-04-18T13:05:00.000Z"),
        approvedAt: new Date("2026-04-18T13:05:00.000Z"),
        retryCount: 0,
        usableForPasswordRecovery: true,
        reviewedById: adminUser.id,
        reviewNotes: "Verificacao facial aprovada para uso futuro em recuperacao de senha.",
      },
    ],
  });

  const trustConsentCarlos = await prisma.consentRecord.create({
    data: {
      userId: workerOneUser.id,
      type: "TRUST_IDENTITY",
      title: "Consentimento para verificacao de identidade e confianca da plataforma",
      acceptedAt: new Date("2026-04-14T10:00:00.000Z"),
    },
  });

  const trustConsentFernanda = await prisma.consentRecord.create({
    data: {
      userId: workerTwoUser.id,
      type: "TRUST_IDENTITY",
      title: "Consentimento para verificacao de identidade e confianca da plataforma",
      acceptedAt: new Date("2026-04-11T09:00:00.000Z"),
    },
  });

  const trustConsentRafael = await prisma.consentRecord.create({
    data: {
      userId: workerThreeUser.id,
      type: "TRUST_IDENTITY",
      title: "Consentimento para verificacao de identidade e confianca da plataforma",
      acceptedAt: new Date("2026-04-19T09:00:00.000Z"),
    },
  });

  await prisma.trustVerificationRequest.createMany({
    data: [
      {
        userId: workerOneUser.id,
        workerProfileId: workerProfiles.carlos.id,
        consentRecordId: trustConsentCarlos.id,
        type: "DOCUMENT",
        status: "VERIFIED",
        documentType: "CPF e comprovante de endereco",
        documentReference: "CPF final 1001",
        submittedAt: new Date("2026-04-14T10:05:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-14T14:15:00.000Z"),
        verifiedAt: new Date("2026-04-14T14:15:00.000Z"),
      },
      {
        userId: workerOneUser.id,
        workerProfileId: workerProfiles.carlos.id,
        consentRecordId: trustConsentCarlos.id,
        type: "FACE",
        status: "VERIFIED",
        provider: "internal-v1",
        providerReference: "facial-enrollments/carlos/approved-001",
        submittedAt: new Date("2026-04-14T10:02:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-14T14:15:00.000Z"),
        verifiedAt: new Date("2026-04-14T14:15:00.000Z"),
      },
      {
        userId: workerOneUser.id,
        workerProfileId: workerProfiles.carlos.id,
        consentRecordId: trustConsentCarlos.id,
        type: "ADMIN_REVIEW",
        status: "VERIFIED",
        submittedAt: new Date("2026-04-14T14:16:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-14T14:20:00.000Z"),
        verifiedAt: new Date("2026-04-14T14:20:00.000Z"),
      },
      {
        userId: workerTwoUser.id,
        workerProfileId: workerProfiles.fernanda.id,
        consentRecordId: trustConsentFernanda.id,
        type: "DOCUMENT",
        status: "VERIFIED",
        documentType: "CPF e comprovante de atividade",
        documentReference: "CPF final 1002",
        submittedAt: new Date("2026-04-11T09:10:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-11T13:00:00.000Z"),
        verifiedAt: new Date("2026-04-11T13:00:00.000Z"),
      },
      {
        userId: workerTwoUser.id,
        workerProfileId: workerProfiles.fernanda.id,
        consentRecordId: trustConsentFernanda.id,
        type: "FACE",
        status: "VERIFIED",
        provider: "internal-v1",
        providerReference: "facial-enrollments/fernanda/approved-001",
        submittedAt: new Date("2026-04-11T09:12:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-11T13:00:00.000Z"),
        verifiedAt: new Date("2026-04-11T13:00:00.000Z"),
      },
      {
        userId: workerTwoUser.id,
        workerProfileId: workerProfiles.fernanda.id,
        consentRecordId: trustConsentFernanda.id,
        type: "ADMIN_REVIEW",
        status: "VERIFIED",
        submittedAt: new Date("2026-04-11T13:01:00.000Z"),
        reviewedById: adminUser.id,
        reviewedAt: new Date("2026-04-11T13:10:00.000Z"),
        verifiedAt: new Date("2026-04-11T13:10:00.000Z"),
      },
      {
        userId: workerThreeUser.id,
        workerProfileId: workerProfiles.rafael.id,
        consentRecordId: trustConsentRafael.id,
        type: "DOCUMENT",
        status: "PENDING",
        documentType: "CNH e comprovante de atividade",
        documentReference: "CNH final 1004",
        submittedAt: new Date("2026-04-19T09:11:00.000Z"),
      },
      {
        userId: workerThreeUser.id,
        workerProfileId: workerProfiles.rafael.id,
        consentRecordId: trustConsentRafael.id,
        type: "FACE",
        status: "IN_REVIEW",
        provider: "internal-v1",
        providerReference: "facial-enrollments/rafael/review-001",
        submittedAt: new Date("2026-04-19T09:12:00.000Z"),
      },
      {
        userId: workerThreeUser.id,
        workerProfileId: workerProfiles.rafael.id,
        consentRecordId: trustConsentRafael.id,
        type: "ADMIN_REVIEW",
        status: "IN_REVIEW",
        submittedAt: new Date("2026-04-19T09:30:00.000Z"),
      },
    ],
  });

  await prisma.workerProfile.update({
    where: { id: workerProfiles.carlos.id },
    data: {
      trustVerificationStatus: "VERIFIED",
      publicTrustBadgeEnabled: true,
    },
  });

  await prisma.workerProfile.update({
    where: { id: workerProfiles.fernanda.id },
    data: {
      trustVerificationStatus: "VERIFIED",
      publicTrustBadgeEnabled: true,
    },
  });

  await prisma.workerProfile.update({
    where: { id: workerProfiles.rafael.id },
    data: {
      trustVerificationStatus: "IN_REVIEW",
      publicTrustBadgeEnabled: false,
    },
  });

  await prisma.moderationReport.createMany({
    data: [
      {
        targetType: "REVIEW",
        reason: "LOW_QUALITY",
        status: "OPEN",
        description: "Avaliacao de Fernanda Rocha aguardando revisao antes da publicacao.",
        reporterId: adminUser.id,
        reviewId: reviewThree.id,
      },
      {
        targetType: "REVIEW",
        reason: "OTHER",
        status: "RESOLVED",
        description: "Feedback de Carlos Mendes revisado e aprovado.",
        reporterId: adminUser.id,
        reviewId: reviewOne.id,
        resolvedAt: new Date(),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: clientOneUser.id,
        type: "QUOTE_UPDATED",
        title: "Orcamento concluido",
        body: "Seu pedido ORC-2001 foi marcado como concluido e ja pode ser avaliado.",
        actionUrl: "/painel/cliente/orcamentos",
      },
      {
        userId: workerTwoUser.id,
        type: "REVIEW_CREATED",
        title: "Nova avaliacao recebida",
        body: "Um cliente enviou avaliacao para seu perfil. Ela esta em moderacao.",
        actionUrl: "/painel/profissional/avaliacoes",
      },
      {
        userId: adminUser.id,
        type: "MODERATION_UPDATED",
        title: "Fila de moderacao atualizada",
        body: "Existem conteudos aguardando revisao administrativa.",
        actionUrl: "/admin/moderacao",
      },
    ],
  });

  await prisma.platformSetting.createMany({
    data: [
      {
        key: "platform.name",
        value: "AutonomoPro",
        valueType: "STRING",
        description: "Nome publico da plataforma",
        isPublic: true,
        updatedById: adminUser.id,
      },
      {
        key: "marketplace.contact.whatsapp_enabled",
        value: true,
        valueType: "BOOLEAN",
        description: "Habilita botao de WhatsApp nos perfis aprovados",
        isPublic: false,
        updatedById: adminUser.id,
      },
      {
        key: "marketplace.reviews.require_moderation",
        value: true,
        valueType: "BOOLEAN",
        description: "Publica avaliacoes somente apos moderacao",
        isPublic: false,
        updatedById: adminUser.id,
      },
      {
        key: "security.identity.client_facial_enrollment_enabled",
        value: true,
        valueType: "BOOLEAN",
        description: "Habilita verificacao facial opcional para clientes",
        isPublic: false,
        updatedById: adminUser.id,
      },
    ],
  });

  await prisma.adminLog.createMany({
    data: [
      {
        actorId: adminUser.id,
        action: "seed.run",
        entity: "database",
        entityId: "development",
        metadata: { users: 6, workers: 3, quotes: 3 },
      },
      {
        actorId: adminUser.id,
        action: "review.approve",
        entity: "review",
        entityId: reviewTwo.id,
      },
    ],
  });

  console.log("Seed concluido com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
