enum ScreenEvent {
    FLOW_IN = '@@fluid-router/FLOW_IN',
    FLOW_OUT = '@@fluid-router/FLOW_OUT',
    ACTIVE = '@@fluid-router/ACTIVE',
    INACTIVE = '@@fluid-router/INACTIVE'
}
enum FlowDirection {
    FORWARD = 'FORWARD',
    BACK = 'BACK'
}
enum ActionType {
    PUSH = 'PUSH',
    REPLACE = 'REPLACE'
}
enum ScreenHistoryState {
    PAST = 'PAST',
    CURRENT = 'CURRENT',
    OUTSIDE = 'OUTSIDE'
}
