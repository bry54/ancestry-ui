export enum Agent {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

export enum Role {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export enum LanguageCode {
  EN = 'en',
  SN = 'sn',
  ND = 'nd',
  FR = 'fr',
  JA = 'ja',
  ZH = 'zh',
}

export enum OAuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  SLACK = 'slack',
}

export enum LifeStatus {
  ALIVE = 'ALIVE',
  DECEASED = 'DECEASED',
  UNKNOWN = 'UNKNOWN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum LineageSide {
  Maternal = 'MATERNAL',
  Paternal = 'PATERNAL',
}

export enum RelationshipType {
  Parent = 'PARENT',
  Child = 'CHILD',
  Sibling = 'SIBLING',
  HalfSibling = 'HALF_SIBLING',
  Spouse = 'SPOUSE',
  GrandParent = 'GRANDPARENT',
  GrandChild = 'GRANDCHILD',
  UncleOrAunt = 'UNCLE_OR_AUNT', // Sibling of parent
  NieceOrNephew = 'NIECE_OR_NEPHEW', // Child of sibling
  Cousin = 'COUSIN',
  ParentInLaw = 'PARENT_IN_LAW',
  SiblingInLaw = 'SIBLING_IN_LAW',
  ChildInLaw = 'CHILD_IN_LAW',
  StepParent = 'STEPPARENT',
  StepChild = 'STEPCHILD',
  StepSibling = 'STEPSIBLING',
  Guardian = 'GUARDIAN',
  Ward = 'WARD',
  AdoptiveParent = 'ADOPTIVE_PARENT',
  AdoptedChild = 'ADOPTED_CHILD',
  GodParent = 'GODPARENT',
  GodChild = 'GODCHILD',
  Fiance = 'FIANCE',
  ExSpouse = 'EX_SPOUSE',
  Friend = 'FRIEND',
  Other = 'OTHER',
}
