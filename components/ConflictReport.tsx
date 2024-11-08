import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { Conflict } from '../types';

interface ConflictReportProps {
  conflicts: Conflict[];
}

export default function ConflictReport({ conflicts }: ConflictReportProps) {
  return (
    <Paper className="my-4 p-4">
      <Typography variant="h6" gutterBottom>Scheduling Conflicts</Typography>
      <List>
        {conflicts.map((conflict, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Course: ${conflict.course}`}
              secondary={
                <>
                  {conflict.preferences.map((pref, prefIndex) => (
                    <Typography key={prefIndex} component="span" variant="body2" color="textSecondary" display="block">
                      Preference {prefIndex + 1}: {pref.preference} - {pref.reason}
                    </Typography>
                  ))}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}