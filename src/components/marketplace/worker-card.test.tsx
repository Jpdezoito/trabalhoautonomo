import { fireEvent, render, screen } from "@testing-library/react";
import { WorkerCard } from "@/components/marketplace/worker-card";
import type { Worker } from "@/types/marketplace";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string | { src: string };
    fill?: boolean;
    priority?: boolean;
  }) {
    void fill;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={typeof src === "string" ? src : src.src} alt={alt ?? ""} {...props} />;
  },
}));

const mockWorker: Worker = {
  name: "Ana Souza",
  slug: "ana-souza",
  role: "Eletricista",
  headline: "Instalações elétricas residenciais e pequenos reparos.",
  bio: "Profissional com experiência em manutenção elétrica residencial.",
  city: "São Paulo",
  neighborhood: "Vila Mariana",
  rating: 4.9,
  reviewsCount: 57,
  jobsDone: 120,
  responseTime: "Responde em até 20 min",
  verified: true,
  available: true,
  lastActivityAt: "2026-04-30T10:00:00.000Z",
  plan: "PRO",
  image: "https://example.com/ana.jpg",
  coverImage: "https://example.com/ana-cover.jpg",
  services: ["Eletricista residencial", "Troca de disjuntores"],
  categories: ["eletricistas"],
  areas: ["Vila Mariana", "São Paulo"],
  yearsExperience: 8,
  whatsapp: "5511999999999",
  phone: "11999999999",
  startingPrice: "R$ 120",
  contactSettings: {
    showWhatsapp: true,
    showPhone: true,
    allowQuotes: true,
    allowShare: true,
  },
  identityVerification: {
    status: "aprovado",
  },
  trustVerification: {
    status: "verificado",
    badgeEnabled: true,
    protectionLevel: "reforcado",
  },
  portfolio: [],
  reviews: [],
};

describe("WorkerCard", () => {
  it("renderiza os dados do profissional, a imagem e permite acionar o contato por WhatsApp", () => {
    const handleWhatsappClick = jest.fn();

    render(<WorkerCard worker={mockWorker} onWhatsappClick={handleWhatsappClick} />);

    expect(screen.getByRole("heading", { name: mockWorker.name })).toBeInTheDocument();
    expect(screen.getByText("Eletricista residencial")).toBeInTheDocument();
    expect(screen.getByText(/4,9 \(57 avaliações\)/i)).toBeInTheDocument();

    const profileImage = screen.getByRole("img", { name: mockWorker.name });
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src", mockWorker.image);

    const whatsappButton = screen.getByRole("button", {
      name: `Chamar ${mockWorker.name} no WhatsApp`,
    });
    expect(whatsappButton).toBeInTheDocument();
    expect(whatsappButton).toBeEnabled();

    fireEvent.click(whatsappButton);

    expect(handleWhatsappClick).toHaveBeenCalledTimes(1);
    expect(handleWhatsappClick).toHaveBeenCalledWith(mockWorker);
  });
});
