import { Box, Typography, Container, Link, Divider, Stack, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',  href: '#features'  },
      { label: 'Security',  href: '#security'  },
      { label: 'Pricing',   href: '#pricing'   },
      { label: 'Changelog', href: '#changelog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   href: '#about'   },
      { label: 'Blog',    href: '#blog'    },
      { label: 'Careers', href: '#careers' },
      { label: 'Support', href: '#support' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '#privacy' },
      { label: 'Terms of Service',  href: '#terms'   },
      { label: 'Cookie Policy',     href: '#cookies' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <GitHub fontSize="small" />,   href: '#', label: 'GitHub'   },
  { icon: <Twitter fontSize="small" />,  href: '#', label: 'Twitter'  },
  { icon: <LinkedIn fontSize="small" />, href: '#', label: 'LinkedIn' },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* ── Upper section ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '2fr 1fr 1fr 1fr',
            },
            gap: { xs: 4, md: 6 },
            py: { xs: 5, md: 6 },
          }}
        >
          {/* Brand column */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              color="primary.main"
              letterSpacing="-0.5px"
              gutterBottom
            >
              Expense App
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 260, lineHeight: 1.7, mb: 2.5 }}
            >
              Streamline expense management across your entire organisation — from submission to approval.
            </Typography>

            {/* Social icons */}
            <Stack direction="row" gap={0.5}>
              {SOCIAL_LINKS.map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  aria-label={label}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                    transition: 'color 0.2s, background 0.2s',
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Link groups */}
          {NAV_GROUPS.map(({ heading, links }) => (
            <Box key={heading}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.primary"
                letterSpacing="0.08em"
                textTransform="uppercase"
                display="block"
                mb={2}
              >
                {heading}
              </Typography>
              <Stack gap={1.25}>
                {links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    underline="none"
                    sx={{
                      typography: 'body2',
                      color: 'text.secondary',
                      width: 'fit-content',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: 0,
                        width: '0%',
                        height: '1px',
                        bgcolor: 'primary.main',
                        transition: 'width 0.2s ease',
                      },
                      '&:hover': { color: 'primary.main' },
                      '&:hover::after': { width: '100%' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider />

        {/* ── Bottom bar ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            
          }}
        >
          <Typography variant="caption" color="text.disabled">
            © {year} Enterprise Inc. All rights reserved.
          </Typography>

          <Stack direction="row" gap={2.5} flexWrap="wrap" justifyContent="center">
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <Link
                key={label}
                href="#"
                underline="hover"
                sx={{ typography: 'caption', color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
              >
                {label}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};