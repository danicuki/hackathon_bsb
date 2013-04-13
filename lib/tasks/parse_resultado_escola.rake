desc "Parse prova Brasil info"
# Example: rake parse_resultado_escola[/path/to/microdados_prova_brasil_2011/Dados/TS_RESULTADO_ESCOLA.csv]

# TODO: This is duplicated code, shared with other(s) task(s)
def find_or_create_school(id)
  results = School.where(:pk_cod_entidade => id)

  if results.count > 0
    school = results.first
  else
    school = School.create!(
      pk_cod_entidade: id,
      # Required fields
      location: [0, 0],
      gmaps: true
    )
  end

  return school
end

def getFloat(string)
  string.strip!
  if string.empty?
    float = -1
  else
    float = string.chomp.sub(',', '.').to_f
  end

  return float
end

task :parse_resultado_escola, [:file] => :environment do |t, args|
  codSaoPaulo = '3550308'

  IO.foreach(args.file) do |line|
    fields = line.split(';')

    # Using same names than header, but lowercase

    # Only city of São Paulo so far
    id_municipio = fields[2]
    next if id_municipio != codSaoPaulo

    # Getting school in database to be updated
    id_escola = fields[3].to_i
    school = find_or_create_school(id_escola)

    # Initializing Grade object
    id_serie = fields[6].to_i
    grade = school.grades.find_or_create_by(:id_serie => id_serie)

    # Adding/Updating fields
    grade.media_lp = getFloat(fields[11])
    grade.media_mt = getFloat(fields[12])

    school.save!
  end
end
