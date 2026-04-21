from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import webbrowser
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROMPTS_FILE = ROOT / "oi.txt"
PROGRESS_FILE = ROOT / "docs" / "prompt-progress.json"
DEFAULT_SITE_URL = "http://127.0.0.1:3000"


@dataclass(frozen=True)
class Prompt:
    number: int
    title: str
    body: str


def read_text(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(errors="replace")


def load_prompts() -> list[Prompt]:
    if not PROMPTS_FILE.exists():
        raise SystemExit(f"Arquivo nao encontrado: {PROMPTS_FILE}")

    text = read_text(PROMPTS_FILE)
    pattern = re.compile(
        r"##\s+Prompt\s+(\d+)\s+[^\n]*?([^\n\r]*)\r?\n+```text\r?\n(.*?)\r?\n```",
        re.DOTALL,
    )

    prompts: list[Prompt] = []
    for match in pattern.finditer(text):
        number = int(match.group(1))
        title = clean_title(match.group(2))
        body = match.group(3).strip()
        prompts.append(Prompt(number=number, title=title, body=body))

    if not prompts:
        raise SystemExit("Nenhum prompt foi encontrado dentro de oi.txt.")

    return sorted(prompts, key=lambda prompt: prompt.number)


def clean_title(value: str) -> str:
    title = value.strip(" -—â€”\t")
    return title or "Sem titulo"


def load_progress() -> dict[str, int]:
    if not PROGRESS_FILE.exists():
        return {"last_completed": 11}

    try:
        data = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"last_completed": 11}

    return {"last_completed": int(data.get("last_completed", 11))}


def save_progress(last_completed: int) -> None:
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    PROGRESS_FILE.write_text(
        json.dumps({"last_completed": last_completed}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def copy_to_clipboard(text: str) -> bool:
    if sys.platform.startswith("win"):
        subprocess.run("clip", input=text, text=True, check=True)
        return True

    for command in (["pbcopy"], ["xclip", "-selection", "clipboard"], ["wl-copy"]):
        try:
            subprocess.run(command, input=text, text=True, check=True)
            return True
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue

    return False


def get_prompt(prompts: list[Prompt], number: int) -> Prompt | None:
    return next((prompt for prompt in prompts if prompt.number == number), None)


def command_status(prompts: list[Prompt]) -> None:
    progress = load_progress()
    last_completed = progress["last_completed"]
    next_number = last_completed + 1
    next_prompt = get_prompt(prompts, next_number)

    print(f"Ultimo prompt concluido: {last_completed}")
    if next_prompt:
        print(f"Proximo prompt: {next_prompt.number} - {next_prompt.title}")
    else:
        print("Nao ha proximo prompt pendente.")


def command_next(prompts: list[Prompt], should_copy: bool) -> None:
    progress = load_progress()
    prompt = get_prompt(prompts, progress["last_completed"] + 1)

    if not prompt:
        print("Nao ha proximo prompt pendente.")
        return

    print(f"Prompt {prompt.number} - {prompt.title}")
    print("-" * 80)
    print(prompt.body)
    print("-" * 80)

    if should_copy:
        copied = copy_to_clipboard(prompt.body)
        if copied:
            print("Prompt copiado para a area de transferencia.")
        else:
            print("Nao foi possivel copiar automaticamente neste sistema.")


def command_done(prompts: list[Prompt], number: int | None) -> None:
    progress = load_progress()
    completed = number if number is not None else progress["last_completed"] + 1

    if not get_prompt(prompts, completed):
        raise SystemExit(f"Prompt {completed} nao existe em oi.txt.")

    save_progress(completed)
    print(f"Prompt {completed} marcado como concluido.")
    command_status(prompts)


def command_set(prompts: list[Prompt], number: int) -> None:
    if number < 0:
        raise SystemExit("O numero precisa ser maior ou igual a zero.")

    max_prompt = max(prompt.number for prompt in prompts)
    if number > max_prompt:
        raise SystemExit(f"O maior prompt encontrado e {max_prompt}.")

    save_progress(number)
    print(f"Progresso ajustado. Ultimo concluido: {number}")
    command_status(prompts)


def command_open_site(url: str) -> None:
    webbrowser.open(url)
    print(f"Abrindo site no navegador: {url}")


def command_start_site(open_after_start: bool) -> None:
    npm_command = "npm.cmd" if sys.platform.startswith("win") else "npm"
    subprocess.Popen(
        [npm_command, "run", "dev", "--", "--hostname", "127.0.0.1"],
        cwd=ROOT,
        creationflags=subprocess.CREATE_NEW_CONSOLE if sys.platform.startswith("win") else 0,
    )
    print("Servidor de desenvolvimento iniciado.")
    print(f"URL: {DEFAULT_SITE_URL}")
    if open_after_start:
        webbrowser.open(DEFAULT_SITE_URL)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Assistente local para seguir os prompts do projeto.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    next_parser = subparsers.add_parser("next", help="Mostra o proximo prompt.")
    next_parser.add_argument("--no-copy", action="store_true", help="Nao copiar para a area de transferencia.")

    done_parser = subparsers.add_parser("done", help="Marca o prompt atual como concluido.")
    done_parser.add_argument("number", nargs="?", type=int, help="Numero especifico do prompt concluido.")

    set_parser = subparsers.add_parser("set", help="Define manualmente o ultimo prompt concluido.")
    set_parser.add_argument("number", type=int)

    subparsers.add_parser("status", help="Mostra o progresso atual.")

    open_parser = subparsers.add_parser("open-site", help="Abre o site no navegador.")
    open_parser.add_argument("--url", default=DEFAULT_SITE_URL)

    start_parser = subparsers.add_parser("start-site", help="Inicia npm run dev.")
    start_parser.add_argument("--no-open", action="store_true", help="Nao abrir o navegador depois de iniciar.")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    prompts = load_prompts()

    if args.command == "next":
        command_next(prompts, should_copy=not args.no_copy)
    elif args.command == "done":
        command_done(prompts, args.number)
    elif args.command == "set":
        command_set(prompts, args.number)
    elif args.command == "status":
        command_status(prompts)
    elif args.command == "open-site":
        command_open_site(args.url)
    elif args.command == "start-site":
        command_start_site(open_after_start=not args.no_open)


if __name__ == "__main__":
    main()
