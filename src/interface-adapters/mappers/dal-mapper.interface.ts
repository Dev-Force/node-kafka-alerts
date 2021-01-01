export interface DALMapper<DomainType, DALEntityType> {
  fromDALEntityToDomain(entity: DALEntityType): DomainType;
  fromDomainToDALEntity(domainObj: DomainType): DALEntityType;
}
