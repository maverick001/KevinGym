from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(34, 85, 55)
        self.set_text_color(255, 255, 255)
        self.rect(0, 0, 210, 14, 'F')
        self.set_xy(0, 3)
        self.cell(0, 8, 'KevinGym - Design Pattern Documentation', align='C')
        self.set_text_color(0, 0, 0)
        self.ln(12)

    def footer(self):
        self.set_y(-12)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, f'Page {self.page_no()}', align='C')

    def section_title(self, number, title, subtitle):
        self.set_fill_color(34, 85, 55)
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 13)
        self.rect(10, self.get_y(), 190, 10, 'F')
        self.set_x(12)
        self.cell(0, 10, f'Pattern {number}: {title}', ln=True)
        self.set_text_color(0, 0, 0)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(100, 100, 100)
        self.set_x(12)
        self.cell(0, 7, subtitle, ln=True)
        self.set_text_color(0, 0, 0)
        self.ln(3)

    def sub_heading(self, text):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(34, 85, 55)
        self.set_x(12)
        self.cell(0, 7, text, ln=True)
        self.set_text_color(0, 0, 0)

    def body_text(self, text):
        self.set_font('Helvetica', '', 9.5)
        self.set_x(12)
        self.multi_cell(186, 6, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font('Helvetica', '', 9.5)
        self.set_x(14)
        self.cell(5, 6, chr(149), ln=False)
        self.multi_cell(181, 6, text)

    def code_block(self, lines):
        self.set_fill_color(245, 245, 245)
        self.set_draw_color(210, 210, 210)
        self.set_font('Courier', '', 8.5)
        x, y = 12, self.get_y()
        height = len(lines) * 5.5 + 4
        self.rect(x, y, 186, height, 'FD')
        self.set_xy(x + 3, y + 2)
        for line in lines:
            self.set_x(x + 3)
            self.cell(180, 5.5, line, ln=True)
        self.ln(3)

    def table(self, headers, rows):
        col_widths = [186 // len(headers)] * len(headers)
        self.set_fill_color(34, 85, 55)
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 9)
        self.set_x(12)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True)
        self.ln()
        self.set_text_color(0, 0, 0)
        self.set_font('Helvetica', '', 9)
        for r_idx, row in enumerate(rows):
            self.set_fill_color(245, 248, 245) if r_idx % 2 == 0 else self.set_fill_color(255, 255, 255)
            self.set_x(12)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6.5, cell, border=1, fill=True)
            self.ln()
        self.ln(3)

    def divider(self):
        self.set_draw_color(200, 200, 200)
        y = self.get_y() + 2
        self.line(12, y, 198, y)
        self.ln(5)


pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# -- Title page block ----------------------------------------------------------
pdf.ln(4)
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(34, 85, 55)
pdf.cell(0, 12, 'KevinGym - Design Patterns', align='C', ln=True)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, 'State Pattern  &  Builder Pattern', align='C', ln=True)
pdf.set_font('Helvetica', 'I', 9)
pdf.cell(0, 6, 'MERN Stack Implementation  |  QUT Assignment', align='C', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.ln(6)
pdf.divider()

# ===============================================================================
# PATTERN 1 - STATE
# ===============================================================================
pdf.section_title('1', 'State Pattern', 'Feature: Membership Management')

pdf.sub_heading('What is the State Pattern?')
pdf.body_text(
    'The State Pattern allows an object to change its behaviour when its internal state changes. '
    'The object appears to change its class. Instead of using large if/else chains, each state is '
    'encapsulated in its own class that defines what the object can and cannot do in that state.'
)

pdf.sub_heading('How it is used in KevinGym')
pdf.body_text(
    'Every user has a membership status. Depending on the status, the member can or cannot book '
    'classes and access content. The status follows a strict transition graph - invalid jumps are '
    'rejected by the MembershipContext.'
)

pdf.sub_heading('State Transition Diagram')
pdf.code_block([
    '  Trial  ------> Active  ------> Suspended',
    '    |               |                |',
    '    `---> Expired <--+                `---> Active',
    '                 ?                         |',
    '                 `------- Trial <-----------+',
])

pdf.sub_heading('Files Created')
pdf.table(
    ['File', 'Role'],
    [
        ['backend/membership/MembershipState.js',   'Abstract base class - defines the interface'],
        ['backend/membership/TrialState.js',         'canBook=true, canAccess=true, limited bookings'],
        ['backend/membership/ActiveState.js',        'canBook=true, canAccess=true, full access'],
        ['backend/membership/SuspendedState.js',     'canBook=false, canAccess=false'],
        ['backend/membership/ExpiredState.js',       'canBook=false, canAccess=false, prompts renewal'],
        ['backend/membership/MembershipContext.js',  'Holds current state, validates transitions'],
        ['backend/controllers/membershipController.js', 'GET /api/membership/status, PUT /:id/transition'],
        ['backend/routes/membershipRoutes.js',       'Route definitions'],
    ]
)

pdf.sub_heading('Code Example - MembershipContext')
pdf.code_block([
    'transitionTo(newStatusName) {',
    '  const allowed = this.state.allowedTransitions();',
    '  if (!allowed.includes(newStatusName)) {',
    '    throw new Error(`Cannot transition from ${this.state.getName()} to ${newStatusName}`);',
    '  }',
    '  this.state = new STATE_MAP[newStatusName]();',
    '}',
])

pdf.sub_heading('Code Example - TrialState')
pdf.code_block([
    'class TrialState extends MembershipState {',
    '  getName()            { return "trial"; }',
    '  canBookClass()       { return true; }',
    '  canAccessContent()   { return true; }',
    '  allowedTransitions() { return ["active", "expired"]; }',
    '}',
])

pdf.sub_heading('Observer Integration')
pdf.body_text(
    'Every membership transition emits a "membershipTransitioned" event on gymEvents. '
    'LoggerObserver logs it to the console and NotificationObserver stores a notification in MongoDB.'
)
pdf.code_block([
    'gymEvents.emit("membershipTransitioned", {',
    '  name, email, from: previousStatus, to: ctx.getName()',
    '});',
])

pdf.sub_heading('Frontend Changes')
pdf.bullet('Member Panel - live colour-coded badge (blue=trial, green=active, yellow=suspended, red=expired)')
pdf.bullet('Member Panel - "Browse New Class" button disabled when canBookClass is false')
pdf.bullet('Admin Dashboard - Membership column in users table with coloured badges')
pdf.bullet('Admin Dashboard - Edit form dropdown shows only valid next states for selected user')

pdf.divider()

# ===============================================================================
# PATTERN 2 - BUILDER
# ===============================================================================
pdf.section_title('2', 'Builder Pattern', 'Feature: Workout Plan Builder')

pdf.sub_heading('What is the Builder Pattern?')
pdf.body_text(
    'The Builder Pattern separates the construction of a complex object from its representation. '
    'A director (or client) calls a sequence of builder methods to configure the object step by step, '
    'then calls build() to get the final validated result. This prevents complex constructors with '
    'many parameters and makes the construction logic reusable and readable.'
)

pdf.sub_heading('How it is used in KevinGym')
pdf.body_text(
    'Vendors assign personalised workout plans to members. A WorkoutPlanBuilder chains method calls '
    'to set the title, difficulty, duration, and exercises. Each step validates its input immediately. '
    'build() performs a final check before returning the completed plan object for saving to MongoDB.'
)

pdf.sub_heading('Builder Chain (fluent interface)')
pdf.code_block([
    'const planData = new WorkoutPlanBuilder()',
    '  .setTitle("8-Week Strength")',
    '  .setDifficulty("intermediate")',
    '  .setDuration(8)',
    '  .addExercise({ name: "Squat",       sets: 4, reps: "8" })',
    '  .addExercise({ name: "Bench Press", sets: 3, reps: "10" })',
    '  .addExercise({ name: "Deadlift",    sets: 3, reps: "6" })',
    '  .setNotes("Rest 90 seconds between sets.")',
    '  .build();',
])

pdf.sub_heading('Files Created')
pdf.table(
    ['File', 'Role'],
    [
        ['backend/builder/WorkoutPlanBuilder.js',         'The builder class with fluent API'],
        ['backend/models/WorkoutPlan.js',                  'Mongoose schema (memberId, exercises[], etc.)'],
        ['backend/controllers/workoutPlanController.js',   'Uses builder to construct plan before saving'],
        ['backend/routes/workoutPlanRoutes.js',            'POST /api/workout-plans, GET /my, GET /member/:id'],
        ['frontend/src/pages/WorkoutPlanPage.jsx',         'Member view - shows plan, difficulty badge, table'],
    ]
)

pdf.sub_heading('Code Example - WorkoutPlanBuilder')
pdf.code_block([
    'class WorkoutPlanBuilder {',
    '  setTitle(title)         { this._title = title; return this; }',
    '  setDifficulty(level)    { /* validates enum */ this._difficulty = level; return this; }',
    '  setDuration(weeks)      { /* validates integer */ this._durationWeeks = weeks; return this; }',
    '  addExercise(exercise)   { /* validates name */ this._exercises.push(exercise); return this; }',
    '  setNotes(notes)         { this._notes = notes; return this; }',
    '',
    '  build() {',
    '    if (!this._title) throw new Error("Plan must have a title");',
    '    if (this._exercises.length === 0) throw new Error("Add at least one exercise");',
    '    return { title, difficulty, durationWeeks, exercises, notes };',
    '  }',
    '}',
])

pdf.sub_heading('API Endpoints')
pdf.table(
    ['Method', 'Endpoint', 'Who', 'Description'],
    [
        ['POST', '/api/workout-plans',              'Vendor / Admin', 'Build and assign a plan to a member by email'],
        ['GET',  '/api/workout-plans/my',           'Member',         'Fetch own most recent workout plan'],
        ['GET',  '/api/workout-plans/member/:id',   'Vendor / Admin', 'Fetch any member\'s plan by user ID'],
    ]
)

pdf.sub_heading('Observer Integration')
pdf.body_text(
    'On successful plan creation, a "planCreated" event is emitted. '
    'LoggerObserver logs it and NotificationObserver stores a notification visible to all users.'
)
pdf.code_block([
    'gymEvents.emit("planCreated", { title: plan.title, memberName: member.name });',
])

pdf.sub_heading('Frontend Changes')
pdf.bullet('Vendor Panel - Workout Plan Builder section at the bottom with dynamic exercise rows')
pdf.bullet('Vendor Panel - "Assign Plan" button sends to API, shows success/error message')
pdf.bullet('Member Panel - "Workout Plan" button navigates to /workout-plan')
pdf.bullet('WorkoutPlanPage - shows difficulty badge, duration, and exercise table (sets/reps/notes)')

pdf.divider()

# -- Summary table --------------------------------------------------------------
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(34, 85, 55)
pdf.set_x(12)
pdf.cell(0, 8, 'Summary', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.table(
    ['Pattern', 'Category', 'Feature', 'New Files', 'Observer Events'],
    [
        ['State',   'Behavioural', 'Membership Management', '8', 'membershipTransitioned'],
        ['Builder', 'Creational',  'Workout Plan Builder',  '5', 'planCreated'],
    ]
)

out = '/Users/jishananam/Desktop/QUT/KevinGym/KevinGym_Design_Patterns.pdf'
pdf.output(out)
print(f'PDF saved: {out}')
