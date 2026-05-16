import { PrismaClient } from '../lib/generated/prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Verisyqnal...')

  await prisma.relationship.deleteMany()
  await prisma.entity.deleteMany()
  await prisma.programme.deleteMany()

  // Programme
  const programmeId = nanoid()
  const programme = await prisma.programme.create({
    data: {
      id: programmeId,
      name: 'MAGIC Accelerate Cohort 7',
      cohort: 'Cohort 7',
      owner: 'Cradle Fund',
      geography: ['Malaysia', 'Singapore'],
      status: 'active',
    },
  })
  await prisma.entity.create({
    data: {
      id: programme.id,
      type: 'programme',
      name: programme.name,
      profile: {
        owner: programme.owner,
        geography: programme.geography,
        status: programme.status,
        cohort: programme.cohort,
      },
      tags: ['accelerator', ...programme.geography],
      geography: programme.geography[0] ?? null,
    },
  })
  console.log('✅ Programme:', programme.name)

  // Startups
  const startups = await Promise.all([
    prisma.entity.create({
      data: {
        type: 'startup', name: 'Byte42',
        profile: { company_name: 'Byte42', industry: 'B2B SaaS', stage: 'seed', problem: 'Enterprise HR teams waste 6 hours/week on manual payroll reconciliation across multiple Southeast Asian markets.', solution: 'AI-powered payroll automation platform that integrates with local statutory bodies in MY, SG, and ID.', team_strengths: ['Ex-Grab engineers', 'Deep statutory compliance knowledge', 'Strong BD relationships with enterprise HR heads'], gaps: ['Enterprise sales leadership', 'CFO-level buy-in strategy', 'Series A fundraising narrative'], geography: 'Malaysia', revenue_model: 'SaaS subscription per employee seat', tags: ['B2B SaaS', 'HR Tech', 'Payroll', 'Enterprise'] },
        tags: ['B2B SaaS', 'HR Tech', 'Payroll', 'Enterprise'], geography: 'Malaysia', stage: 'seed',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'startup', name: 'AgriSense',
        profile: { company_name: 'AgriSense', industry: 'AgriTech', stage: 'pre-seed', problem: 'Malaysian paddy farmers lose 20–30% of yields annually due to late detection of soil disease and unpredictable irrigation cycles.', solution: 'IoT sensor network + ML crop health prediction platform with SMS alerts for farmers with no smartphones.', team_strengths: ['Agricultural engineering background', 'Pilot deployed in 3 Kedah villages', 'Partnership with MARDI'], gaps: ['Hardware supply chain scaling', 'Go-to-market for rural farmers', 'Impact investor outreach'], geography: 'Malaysia', revenue_model: 'Device + SaaS subscription via agriculture cooperatives', tags: ['AgriTech', 'IoT', 'ML', 'Deep Tech'] },
        tags: ['AgriTech', 'IoT', 'ML', 'Deep Tech'], geography: 'Malaysia', stage: 'pre-seed',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'startup', name: 'MedChain',
        profile: { company_name: 'MedChain', industry: 'HealthTech', stage: 'seed', problem: 'Patient medical records in Malaysia are siloed across hospitals, leading to duplicate tests, medication errors, and 40-minute average wait times.', solution: 'Interoperable health data platform connecting private clinics and public hospitals with patient-consented data sharing.', team_strengths: ['Licensed medical doctors on founding team', 'MOH pilot approval pending', 'HIPAA-aligned architecture'], gaps: ['Regulatory navigation in Singapore', 'Hospital CIO relationships', 'Clinical workflow change management'], geography: 'Malaysia', revenue_model: 'Per-API-call pricing for health data queries + enterprise licensing to hospital systems', tags: ['HealthTech', 'Data', 'Interoperability', 'Regulatory'] },
        tags: ['HealthTech', 'Data', 'Interoperability', 'Regulatory'], geography: 'Malaysia', stage: 'seed',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'startup', name: 'SkillUp.my',
        profile: { company_name: 'SkillUp.my', industry: 'EdTech', stage: 'pre-seed', problem: 'Malaysian fresh graduates face a 6-month average time-to-employment due to mismatch between university curricula and industry skill requirements.', solution: 'Employer-linked micro-credential platform where companies co-design 8-week bootcamps and directly hire graduates.', team_strengths: ['Ex-Coursera APAC team', '12 corporate partners signed', 'HRDC-claimable courses'], gaps: ['University partnership strategy', 'Student acquisition playbook', 'B2B sales for SME HR'], geography: 'Malaysia', revenue_model: 'Revenue share from employer hiring fees + HRDC-funded course fees', tags: ['EdTech', 'Future of Work', 'B2B', 'Skills'] },
        tags: ['EdTech', 'Future of Work', 'B2B', 'Skills'], geography: 'Malaysia', stage: 'pre-seed',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'startup', name: 'PayNow.SG',
        profile: { company_name: 'PayNow.SG', industry: 'FinTech', stage: 'seed', problem: 'Singapore SMEs lose SGD 2,400/year in FX fees and 3-day settlement delays when collecting payments from Malaysian customers.', solution: 'Cross-border payment rails with real-time MY-SG settlement using existing DuitNow and PayNow infrastructure.', team_strengths: ['Ex-MAS fintech policy lead', 'Payment processing license in both markets', 'Volume commitment from 50 pilot SMEs'], gaps: ['Consumer trust building in Malaysia', 'Bank partnership negotiation', 'Fraud risk management at scale'], geography: 'Singapore', revenue_model: '0.5% transaction fee, volume discounts above SGD 100K/month', tags: ['FinTech', 'Payments', 'Cross-border', 'SME'] },
        tags: ['FinTech', 'Payments', 'Cross-border', 'SME'], geography: 'Singapore', stage: 'seed',
      },
    }),
  ])
  console.log('✅ Startups:', startups.map(s => s.name).join(', '))

  // Mentors
  const mentors = await Promise.all([
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Dato Amir Hamzah',
        profile: { name: 'Dato Amir Hamzah', bio: 'Serial B2B SaaS entrepreneur with 3 exits including a RM90M acquisition by a Singapore-listed company. Spent 12 years scaling enterprise software businesses across SEA.', expertise: ['Enterprise Sales', 'B2B SaaS', 'Series A Fundraising', 'SEA Market Entry'], past_exits: 3, industries: ['B2B SaaS', 'Enterprise Software', 'HR Tech'], geography: 'Malaysia', availability: '6 hours/month', past_mentee_outcomes: ['Led Flexi.works to Series A at RM25M valuation', 'Helped PayTrack close 3 Fortune 500 contracts'] },
        tags: ['B2B SaaS', 'Enterprise Sales', 'Series A', 'SEA'], geography: 'Malaysia',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Dr. Priya Nair',
        profile: { name: 'Dr. Priya Nair', bio: 'Former Head of Digital Health at KPJ Healthcare and ex-WHO digital health advisor. Now advising HealthTech startups on clinical validation, regulatory pathways, and hospital system integration across ASEAN.', expertise: ['HealthTech Regulation', 'Clinical Validation', 'MOH Partnerships', 'Hospital CIO Relationships'], past_exits: 1, industries: ['HealthTech', 'Medical Devices', 'Digital Health'], geography: 'Malaysia', availability: '4 hours/month', past_mentee_outcomes: ['Guided DocConnect through MOH Digital Health Blueprint approval', 'Structured ClinicalOS clinical trial protocol that passed IRB review'] },
        tags: ['HealthTech', 'Regulation', 'Clinical', 'MOH'], geography: 'Malaysia',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Kevin Tan',
        profile: { name: 'Kevin Tan', bio: 'Ex-GIC venture investor turned operator. Built and sold two AgriTech companies in Malaysia and Indonesia. Deep network with plantation groups, FELDA, and impact investors across Southeast Asia.', expertise: ['AgriTech', 'Impact Investing', 'Hardware Scaling', 'Rural Go-to-Market'], past_exits: 2, industries: ['AgriTech', 'CleanTech', 'Food & Beverage'], geography: 'Malaysia', availability: '5 hours/month', past_mentee_outcomes: ['Helped FarmLink scale from 3 to 40 village cooperatives in 14 months', 'Connected PolyHarvest with FELDA strategic partnership'] },
        tags: ['AgriTech', 'Impact', 'Hardware', 'Rural'], geography: 'Malaysia',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Michelle Loh',
        profile: { name: 'Michelle Loh', bio: 'Former VP Partnerships at Grab Financial and ex-MAS fintech policy advisor. Expert in cross-border payment infrastructure, regulatory licensing in MY/SG, and bank partnership negotiation.', expertise: ['FinTech Regulation', 'Cross-border Payments', 'Bank Partnerships', 'MAS/BNM Licensing'], past_exits: 0, industries: ['FinTech', 'Payments', 'RegTech'], geography: 'Singapore', availability: '4 hours/month', past_mentee_outcomes: ['Guided MoneyFlow through MAS Major Payment Institution license process', 'Structured SGX-listed bank partnership for RemitSG'] },
        tags: ['FinTech', 'Regulation', 'Payments', 'MAS'], geography: 'Singapore',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Prof. Rashid Hassan',
        profile: { name: 'Prof. Rashid Hassan', bio: 'Dean of Engineering at Universiti Malaya and founder of two deep tech spinoffs. Expert in IoT systems, embedded ML, and connecting academic research to commercial applications in Southeast Asia.', expertise: ['IoT Architecture', 'Embedded ML', 'University Partnerships', 'Deep Tech Commercialisation'], past_exits: 2, industries: ['Deep Tech', 'AgriTech', 'Smart Cities'], geography: 'Malaysia', availability: '3 hours/month', past_mentee_outcomes: ['Commercialised UM IoT spinoff into SGD 2M government contract', 'Structured IP licensing deal for SensorGrid with Telekom Malaysia'] },
        tags: ['IoT', 'Deep Tech', 'Research', 'Engineering'], geography: 'Malaysia',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Siti Norzalida Binti Ahmad',
        profile: { name: 'Siti Norzalida Binti Ahmad', bio: 'Corporate Innovation Lead at Maybank and ex-McKinsey. Specialises in helping startups navigate large Malaysian corporate procurement, structure enterprise pilot agreements, and convert pilots to long-term contracts.', expertise: ['Corporate Innovation', 'Enterprise Pilots', 'Procurement Navigation', 'Financial Services'], past_exits: 0, industries: ['FinTech', 'HR Tech', 'Enterprise SaaS', 'Banking'], geography: 'Malaysia', availability: '4 hours/month', past_mentee_outcomes: ['Structured RM1.8M Maybank enterprise pilot for ExpenseBot', 'Converted CIMB POC to 3-year SLA contract for ComplianceAI'] },
        tags: ['Corporate', 'Enterprise', 'Banking', 'Procurement'], geography: 'Malaysia',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Dr. Chen Wei',
        profile: { name: 'Dr. Chen Wei', bio: 'EdTech entrepreneur with 2 exits and 15 years building skills platforms across China and Southeast Asia. Expert in employer-linked learning models, government-funded training programmes, and adult education behaviour change.', expertise: ['EdTech Product', 'Employer Partnerships', 'Government Training Grants', 'Adult Learning Science'], past_exits: 2, industries: ['EdTech', 'Future of Work', 'HR Tech'], geography: 'Singapore', availability: '5 hours/month', past_mentee_outcomes: ['Scaled EduBridge from 500 to 12,000 learners in 8 months', 'Secured SGD 800K SkillsFuture partnership for LearnLah'] },
        tags: ['EdTech', 'Skills', 'Government', 'Product'], geography: 'Singapore',
      },
    }),
    prisma.entity.create({
      data: {
        type: 'mentor', name: 'Raj Krishnamurthy',
        profile: { name: 'Raj Krishnamurthy', bio: 'Ex-Sequoia scout and founder of a healthcare data company acquired by IHH Healthcare. Expert in Series A narrative construction, data room preparation, impact investor relationships, and Southeast Asian healthcare regulatory environments.', expertise: ['Series A Fundraising', 'Healthcare Data', 'Impact Investment', 'IHH/KPJ Relationships'], past_exits: 1, industries: ['HealthTech', 'Health Data', 'MedTech'], geography: 'Singapore', availability: '4 hours/month', past_mentee_outcomes: ['Led HealthLedger through SGD 4.5M Series A with impact fund', 'Positioned BioTrack for IHH strategic investment at 3x valuation'] },
        tags: ['HealthTech', 'Series A', 'Data', 'Impact'], geography: 'Singapore',
      },
    }),
  ])
  console.log('✅ Mentors:', mentors.map(m => m.name).join(', '))

  const [byte42, agriSense, medChain, skillUp, payNow] = startups
  const [amir, priya, kevin, michelle, rashid, siti, wei, raj] = mentors

  // Pre-approved relationships (3 mentor_startup)
  const relationships = await Promise.all([
    prisma.relationship.create({
      data: {
        entityAId: byte42.id, entityBId: amir.id, programmeId: programme.id,
        type: 'mentor_startup', status: 'active', formation: 'ai_matched',
        confidence: 91, rationale: 'Dato Amir has 3 exits in B2B SaaS and specifically scaled enterprise payroll software across SEA — exactly the gap Byte42 flagged. His CFO and HR director networks at large Malaysian corporates directly address their enterprise sales leadership weakness.',
        alignmentFactors: ['Enterprise Sales expertise', 'B2B SaaS exits', 'SEA market knowledge', 'Series A fundraising guidance'],
        riskFlags: [], governance: { approved_by: 'admin', approved_at: new Date().toISOString(), can_modify: ['admin', 'programme_owner'] }, memory: [],
      },
    }),
    prisma.relationship.create({
      data: {
        entityAId: agriSense.id, entityBId: kevin.id, programmeId: programme.id,
        type: 'mentor_startup', status: 'active', formation: 'ai_matched',
        confidence: 88, rationale: 'Kevin built and sold two AgriTech companies in Malaysia and Indonesia and has deep relationships with FELDA and plantation groups — directly aligned with AgriSense\'s need to scale across rural farming communities. His hardware scaling experience addresses their supply chain gap.',
        alignmentFactors: ['AgriTech domain expertise', 'Rural go-to-market experience', 'Hardware scaling knowledge', 'Impact investor network'],
        riskFlags: ['Kevin primarily scaled B2C agri products; AgriSense is B2B cooperative model'], governance: { approved_by: 'admin', approved_at: new Date().toISOString(), can_modify: ['admin', 'programme_owner'] }, memory: [],
      },
    }),
    prisma.relationship.create({
      data: {
        entityAId: payNow.id, entityBId: michelle.id, programmeId: programme.id,
        type: 'mentor_startup', status: 'active', formation: 'ai_matched',
        confidence: 94, rationale: 'Michelle\'s dual background as ex-MAS fintech policy advisor and Grab Financial VP puts her at the exact intersection PayNow.SG needs — she has personally structured bank partnerships for cross-border payment rails and navigated the MAS licensing process that PayNow.SG will face in Singapore.',
        alignmentFactors: ['MAS licensing expertise', 'Cross-border payment rails experience', 'Bank partnership relationships', 'FinTech regulatory navigation'],
        riskFlags: [], governance: { approved_by: 'admin', approved_at: new Date().toISOString(), can_modify: ['admin', 'programme_owner'] }, memory: [],
      },
    }),
  ])
  console.log('✅ Mentor-startup relationships:', relationships.length)

  // 5 startup_programme relationships
  const progRels = await Promise.all(
    startups.map(s =>
      prisma.relationship.create({
        data: {
          entityAId: s.id, entityBId: programme.id, programmeId: programme.id,
          type: 'startup_programme', status: 'active', formation: 'admin_assigned',
          alignmentFactors: [], riskFlags: [], memory: [{
            timestamp: new Date().toISOString(),
            event: 'startup_assigned_to_programme',
            actor: 'admin',
            notes: `${s.name} assigned to ${programme.name}`,
          }],
        },
      })
    )
  )
  console.log('✅ Programme assignments:', progRels.length)

  console.log('\n🎉 Seed complete. Database ready for demo.')
  console.log(`   Programme: ${programme.id}`)
  console.log(`   Startups: ${startups.length} | Mentors: ${mentors.length}`)
  console.log(`   Relationships: ${relationships.length + progRels.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
