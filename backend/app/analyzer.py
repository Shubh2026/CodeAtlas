from pathlib import Path
import ast


SUPPORTED_EXTENSIONS = {".py"}


def analyze_project(project_path: Path):
    files = []
    nodes = []
    edges = []

    # Map module/file names to node IDs
    module_map = {}

    # First pass: discover Python files
    for file_path in project_path.rglob("*"):
        if not file_path.is_file():
            continue

        if file_path.suffix not in SUPPORTED_EXTENSIONS:
            continue

        relative_path = file_path.relative_to(project_path)
        file_id = str(relative_path).replace("\\", "/")

        files.append(file_id)

        module_name = ".".join(relative_path.with_suffix("").parts)

        if module_name.endswith(".__init__"):
            module_name = module_name[:-9]

        module_map[module_name] = file_id

        nodes.append({
            "id": file_id,
            "type": "file",
            "label": file_path.name,
            "path": file_id,
        })

    # Second pass: analyze files
    for file_path in project_path.rglob("*"):
        if not file_path.is_file():
            continue

        if file_path.suffix not in SUPPORTED_EXTENSIONS:
            continue

        relative_path = file_path.relative_to(project_path)
        file_id = str(relative_path).replace("\\", "/")

        try:
            source = file_path.read_text(
                encoding="utf-8",
                errors="ignore",
            )

            tree = ast.parse(source)

        except Exception:
            continue

        # Functions and classes
        for item in ast.walk(tree):

            if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                nodes.append({
                    "id": f"{file_id}:{item.lineno}:{item.name}",
                    "type": "function",
                    "label": item.name,
                    "path": file_id,
                    "line": item.lineno,
                })

            elif isinstance(item, ast.ClassDef):
                nodes.append({
                    "id": f"{file_id}:{item.lineno}:{item.name}",
                    "type": "class",
                    "label": item.name,
                    "path": file_id,
                    "line": item.lineno,
                })

        # Imports
        for item in ast.walk(tree):

            # import utils
            # import utils.helpers
            if isinstance(item, ast.Import):

                for alias in item.names:
                    imported_module = alias.name

                    target_file = resolve_module(
                        imported_module,
                        module_map,
                    )

                    if target_file and target_file != file_id:
                        edges.append({
                            "id": f"{file_id}->{target_file}",
                            "source": file_id,
                            "target": target_file,
                            "type": "import",
                        })

            # from utils import something
            elif isinstance(item, ast.ImportFrom):

                if item.module:
                    imported_module = item.module

                    target_file = resolve_module(
                        imported_module,
                        module_map,
                    )

                    if target_file and target_file != file_id:
                        edges.append({
                            "id": f"{file_id}->{target_file}",
                            "source": file_id,
                            "target": target_file,
                            "type": "import",
                        })

    # Remove duplicate edges
    unique_edges = {}

    for edge in edges:
        unique_edges[edge["id"]] = edge

    edges = list(unique_edges.values())

    return {
        "files": files,
        "nodes": nodes,
        "edges": edges,
    }


def resolve_module(module_name: str, module_map: dict):
    """
    Resolve an imported Python module to a discovered file.

    Handles projects where the ZIP contains an extra
    root directory such as:

        codeatlas-sample-repo/
            main.py
            models/user.py
    """

    # Direct match
    if module_name in module_map:
        return module_map[module_name]

    # Try parent modules
    parts = module_name.split(".")

    while parts:
        candidate = ".".join(parts)

        if candidate in module_map:
            return module_map[candidate]

        parts.pop()

    # Handle an extra ZIP/project root folder.
    #
    # Example:
    # import: models.user
    #
    # module map:
    # codeatlas-sample-repo.models.user
    #
    # Find a module whose name ends with ".models.user"
    suffix = "." + module_name

    matches = [
        file_id
        for module, file_id in module_map.items()
        if module.endswith(suffix)
    ]

    if matches:
        return matches[0]

    # Also try parent modules with the project root.
    parts = module_name.split(".")

    while parts:
        candidate = ".".join(parts)
        suffix = "." + candidate

        matches = [
            file_id
            for module, file_id in module_map.items()
            if module.endswith(suffix)
        ]

        if matches:
            return matches[0]

        parts.pop()

    return None