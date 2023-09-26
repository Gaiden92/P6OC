def main() -> None:
    f1 = open("OCMovies-API-EN-FR/api/v1/titles/pagination.py", "w")
    f2 = open("JustStreamIt/pagination.py", "r")
    for line in f2:
        f1.write(line)
    print("La pagination a bien été effectuée.")


if __name__ == '__main__':
    main()