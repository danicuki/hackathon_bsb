class Poi
  include Mongoid::Document
  field :lat, type: Float
  field :long, type: Float
end
