type GetAllDepartment = {
  name: string
  isActive: boolean
  departmentLeaderId: any
  assistDepartmentLeaderIds: any
  departmentalMembers: any
  id: string
  createdAt: string
  updatedAt: string
}


type PeopleData = {
  id: string
  name: string
  isActive: boolean
  departmentLeaderId: string
  assistDepartmentLeaderIds: any[]
  people: People[]
  createdAt: string
  updatedAt: string
  doB: any
  isAssistant: boolean
  isLeader: boolean
}

type People = {
  source: string
  userId: string
  memberId: any
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
  doB: string
  isAssistant: boolean
  isLeader: boolean
}